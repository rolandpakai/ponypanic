import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

import {
  apiApproveHeroTurn,
  apiMapResource,
  apiMapState,
  apiNextLevel,
  apiPlaythroughState,
  apiResetLevel,
  apiStoryBegin,
} from "../api/api";
import {
  arrayToMap,
  getImageSize,
  mapToArray,
  existsItemInLocalStorage,
  getItemFromLocalStorage,
} from "../utils/util";
import {
  FIELD_TYPE,
  GAME_MODE,
  GAME_STATE,
  LOADING_TIMEOUT,
  PLAYER_TOKEN,
  LOCAL_STORAGE_STATE_NAME,
} from "../utils/constants";
import Canvas from "./Canvas";
import PopupDialog from "./PopupDialog";
import Button from "./Button";
import { GameStateContext } from "../contexts/GameStateContext";
import { GameModeContext } from "../contexts/GameModeContext";

const MapContainer = () => {
  const { updateGameMode } = useContext(GameModeContext);
  const { gameState, updateGameState } = useContext(GameStateContext);
  const [canvas, setCanvas] = useState({});
  const [storyToken, setStoryToken] = useState("");
  const [heroTurn, setHeroTurn] = useState({});
  const [dialogProps, setDialogProps] = useState({ open: false });
  const [loading, setLoading] = useState(false);
  const [loadingTurn, setLoadingTurn] = useState(false);

  const updateCanvas = (token, newCanvas) => {
    const newGameState = {
      ...gameState,
      value: { storyToken: token, canvas: newCanvas },
    };

    updateGameState(newGameState);
    setCanvas(newCanvas);
  };

  const updateHeroTurn = (nextHeroTurn) => {
    setHeroTurn(nextHeroTurn);
  };

  const getCanvasData = (mapResource, mapState, currentLevel) => {
    const {
      mapId,
      compressedObstacles: { coordinateMap },
    } = mapResource;

    const { map, heroes } = mapState;

    const size = getImageSize(map.width);
    const obstaclesList = mapToArray(coordinateMap);
    const heroesList = arrayToMap(heroes, FIELD_TYPE.HERO);
    const treasures = arrayToMap(map.treasures, FIELD_TYPE.TREASURE);
    const obstacles = arrayToMap(obstaclesList, FIELD_TYPE.OBSTACLE);
    const enemies = arrayToMap(map.enemies, FIELD_TYPE.ENEMY);
    const bullets = arrayToMap(map.bullets, FIELD_TYPE.BULLET);

    return {
      mapId,
      width: map.width,
      height: map.height,
      fieldSize: size,
      heroes: heroesList,
      enemies,
      bullets,
      treasures,
      obstacles,
      collected: {},
      currentLevel,
      elapsedTickCount: map.elapsedTickCount,
    };
  };

  const setCanvasData = async (token, currentLevel) => {
    const mapResource = await apiMapResource(token);
    const mapState = await apiMapState(token);
    const newCanvas = getCanvasData(mapResource, mapState, currentLevel);

    updateCanvas(token, newCanvas);
  };

  const resetLevel = async (token) => {
    const {
      playthroughState: { currentLevel },
    } = await apiResetLevel(token);

    setCanvasData(token, currentLevel);
    setDialogProps({ ...dialogProps, open: false });
  };

  const nextLevel = async (token) => {
    const {
      playthroughState: { currentLevel },
    } = await apiNextLevel(token);

    setCanvasData(token, currentLevel);
    setDialogProps({ ...dialogProps, open: false });
  };

  const endLevel = async (token) => {
    const {
      playthroughState: { currentLevel },
    } = await apiNextLevel(token);

    const mapResource = await apiMapResource(token);
    const mapState = await apiMapState(token);
    const newCanvas = getCanvasData(mapResource, mapState, currentLevel);

    const newGameState = {
      state: GAME_STATE.END,
      value: { storyToken: token, canvas: newCanvas },
    };

    updateGameState(newGameState);
    updateGameMode(GAME_MODE.UNDEFINED);
  };

  const endHandler = () => {
    endLevel(storyToken);
  };

  const continueHandler = () => {
    resetLevel(storyToken);
  };

  const nextHandler = () => {
    nextLevel(storyToken);
  };

  const dialogPropsStatus = {
    LOST: {
      open: true,
      dialogContentText: "GAME OVER",
      buttonOkText: "CONTINUE",
      buttonCancelText: "END",
      okHandler: continueHandler,
      cancelHandler: endHandler,
    },
    WON: {
      open: true,
      dialogContentText: "CONGRATULATION",
      buttonOkText: "NEXT LEVEL",
      buttonCancelText: "END",
      okHandler: nextHandler,
      cancelHandler: endHandler,
    },
  };

  const getUpdatedData = (map, heroes, turn) => {
    const updates = {
      heroes: arrayToMap(heroes, FIELD_TYPE.HERO, turn),
      enemies: arrayToMap(map.enemies, FIELD_TYPE.ENEMY),
      bullets: arrayToMap(map.bullets, FIELD_TYPE.BULLET),
      elapsedTickCount: map.elapsedTickCount,
    };

    const treasures = arrayToMap(map.treasures, FIELD_TYPE.TREASURE);

    const collectedList = Object.values(treasures).filter(
      (treasure) => treasure.collectedByHeroId != null
    );

    if (collectedList.length > 0) {
      const collected = arrayToMap(
        collectedList,
        FIELD_TYPE.COLLECTED_TREASURE
      );

      updates.collected = collected;
    }

    return updates;
  };

  const showDialog = (mapStatus) => {
    setDialogProps(dialogPropsStatus[mapStatus]);
  };

  const gameOver = async (mapStatus) => {
    await apiPlaythroughState(storyToken);
    showDialog(mapStatus);
  };

  const didTickHappened = async (turn) => {
    const { map, heroes } = await apiMapState(storyToken);
    const updates = getUpdatedData(map, heroes, turn);

    const newCanvas = {
      ...canvas,
      ...updates,
    };

    updateCanvas(storyToken, newCanvas);

    setTimeout(() => {
      setLoadingTurn(false);
    }, LOADING_TIMEOUT);

    if (map.isGameOver) {
      gameOver(map.status);
    }
  };

  const nextTurn = async (turn) => {
    setLoadingTurn(true);

    const { didTickHappen } = await apiApproveHeroTurn(storyToken, turn);

    if (didTickHappen) {
      didTickHappened(turn);
    }
  };

  const nextTurnHandle = () => {
    nextTurn(heroTurn);
  };

  const fetchData = async () => {
    const {
      storyPlaythroughToken,
      playthroughState: { currentLevel },
    } = await apiStoryBegin(PLAYER_TOKEN);

    setCanvasData(storyPlaythroughToken, currentLevel);
    setStoryToken(storyPlaythroughToken);
    setDialogProps({ ...dialogProps, open: false });

    setTimeout(() => {
      setLoading(false);
    }, LOADING_TIMEOUT);
  };

  const loadData = () => {
    if (existsItemInLocalStorage(LOCAL_STORAGE_STATE_NAME)) {
      const storedState = getItemFromLocalStorage(LOCAL_STORAGE_STATE_NAME);

      updateCanvas(storedState.storyToken, storedState.canvas);
      setStoryToken(storedState.storyToken);
      setDialogProps({ ...dialogProps, open: false });

      setTimeout(() => {
        setLoading(false);
      }, LOADING_TIMEOUT);
    }
  };

  useEffect(() => {
    setLoading(true);

    if (gameState.state === GAME_STATE.NEW) {
      fetchData();
    }

    if (gameState.state === GAME_STATE.CONTINUE) {
      loadData();
    }
  }, []);

  return (
    <>
      <Box>
        <Container maxWidth="md">
          <Stack
            direction="row"
            justifyContent="center"
            maxWidth="xs"
            sx={{
              padding: "2rem",
              minHeight: "520px",
              alignItems: "center",
            }}
          >
            {loading ? (
              <CircularProgress
                color="inherit"
                size={150}
                sx={{ color: "var(--progress-color)" }}
              />
            ) : (
              <Box
                sx={{
                  border: "5px solid #3a3b3b",
                }}
              >
                <Canvas canvas={canvas} updateHeroTurn={updateHeroTurn} />
              </Box>
            )}
          </Stack>
        </Container>
        <Container maxWidth="xs">
          <Stack direction="row" justifyContent="center" maxWidth="xs">
            <Button loading={loading || loadingTurn} onClick={nextTurnHandle}>
              HERO TURN
            </Button>
          </Stack>
        </Container>
      </Box>
      <PopupDialog
        open={dialogProps.open}
        dialogContentText={dialogProps.dialogContentText}
        buttonOkText={dialogProps.buttonOkText}
        buttonCancelText={dialogProps.buttonCancelText}
        okHandler={dialogProps.okHandler}
        cancelHandler={dialogProps.cancelHandler}
      />
    </>
  );
};

export default MapContainer;
