import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

import { NewGameContext } from "../contexts/NewGameContext";
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
  getHeroKickRange,
  getHeroMazePath,
  getHeroNextTurn,
  getImageSize,
  mapToArray,
  xyTOij,
} from "../utils/util";
import {
  FIELD_TYPE,
  GAME_MODE,
  MAP_STATUS,
  PLAYER_TOKEN,
} from "../utils/constants";
import { Algorithms, Heuristic } from "../path-finder/constants";
import Canvas from "./Canvas";
import PopupDialog from "./PopupDialog";
import Button from "./Button";
import FieldContainer from "./FieldContainer";

const MapContainer = () => {
  const [gameMode] = useState(GAME_MODE.STORY);
  const { setNewGame } = useContext(NewGameContext);

  const [canvas, setCanvas] = useState({});
  const [storyToken, setStoryToken] = useState("");
  const [heroTurn, setHeroTurn] = useState({});

  const [canvasFields, setCanvasFields] = useState([]);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasMapId, setCanvasMapId] = useState(0);

  const [mazePath, setMazePath] = useState([]);
  const [mazeStep, setMazeStep] = useState(0);
  const [dialogProps, setDialogProps] = useState({ open: false });

  const [loading, setLoading] = useState(false);
  const [loadingTurn, setLoadingTurn] = useState(false);

  const addField = (x, y, fieldType, fieldSize, currentLevel, fields) => {
    const id = `${x}-${y}`;

    fields.push(
      <FieldContainer
        key={id}
        id={id}
        level={currentLevel}
        position={(x, y)}
        size={fieldSize}
        type={fieldType}
      />
    );
  };

  const getCanvasFields = (props) => {
    const {
      width,
      height,
      fieldSize,
      heroes,
      enemies,
      bullets,
      treasures,
      collected,
      obstacles,
      currentLevel,
      elapsedTickCount,
    } = { ...props };

    const fields = [];
    const startNodes = [];
    const endNodes = [];
    const maze = Array.from(Array(height), () => []);
    const hasEnemy = !(Object.keys(enemies).length === 0);

    for (let j = -1; j <= height; j += 1) {
      addField(j, height, FIELD_TYPE.OBSTACLE, fieldSize, currentLevel, fields);
    }

    for (let i = width - 1; i >= 0; i -= 1) {
      for (let j = 0; j < height; j += 1) {
        const id = `${j}-${i}`;
        const xy = xyTOij(i, j, height);

        maze[xy.i][xy.j] = 0;

        if (j === 0) {
          addField(-1, i, FIELD_TYPE.OBSTACLE, fieldSize, currentLevel, fields);
        }

        let field = {
          idd: id,
          position: {
            x: j,
            y: i,
          },
          size: fieldSize,
          level: currentLevel,
          type: FIELD_TYPE.FLOOR,
        };

        if (treasures[id] && !collected[id]) {
          field = { ...field, type: treasures[id].type, data: treasures[id] };
          endNodes.push({ x: xy.j, y: xy.i, id: field.id, idd: id });
        }

        if (heroes[id]) {
          if (hasEnemy) {
            const { kickRange, enemyInKickRange, bulletInRange } =
              getHeroKickRange(heroes[id], enemies, bullets);

            heroes[id].kickRange = kickRange;
            heroes[id].enemyInKickRange = enemyInKickRange;
            heroes[id].bulletInRange = bulletInRange;
          }

          field = {
            ...field,
            type: heroes[id].type,
            data: heroes[id],
          };

          startNodes.push({ x: xy.j, y: xy.i, id: field.id, idd: id });
        }

        if (enemies[id]) {
          if (enemies[id].health > 0) {
            field = { ...field, type: enemies[id].type, data: enemies[id] };
          }
        }

        if (bullets[id]) {
          field = { ...field, type: bullets[id].type, data: bullets[id] };
        }

        if (enemies[id] && bullets[id]) {
          field = {
            ...field,
            type: FIELD_TYPE.ENEMY_BULLET,
            data: enemies[id],
          };
        }

        if (obstacles[id]) {
          field = { ...field, type: obstacles[id].type, data: obstacles[id] };
          maze[xy.i][xy.j] = 2;
        }

        fields.push(
          <FieldContainer
            key={field.idd}
            id={field.id}
            level={field.level}
            position={field.position}
            size={field.size}
            type={field.type}
            data={field.data}
          />
        );

        if (j === width - 1) {
          addField(
            width,
            i,
            FIELD_TYPE.OBSTACLE,
            fieldSize,
            currentLevel,
            fields
          );
        }
      }
    }

    for (let j = -1; j <= height; j += 1) {
      addField(j, -1, FIELD_TYPE.OBSTACLE, fieldSize, currentLevel, fields);
    }

    let step = mazeStep;

    if (elapsedTickCount === 0) {
      step = 0;
    }

    if (gameMode === GAME_MODE.STORY) {
      let nextHeroTurn = {};

      const startNode = startNodes[0];
      const hero = heroes[startNode.idd];

      if (
        collected[startNode.idd] &&
        collected[startNode.idd].collectedByHeroId === hero.id
      ) {
        step = 0;
      }

      if (step === 0) {
        const mazeArg = {
          board: maze,
          startNodes: startNode,
          endNodes,
          algorithm: Algorithms.BFS,
          heuristic: Heuristic.Euclidean,
          rowCount: width,
          colCount: height,
          allowDiagonalMoves: false,
        };

        const newMazePath = getHeroMazePath(mazeArg);

        nextHeroTurn = getHeroNextTurn(hero, newMazePath, hasEnemy, step);

        setMazePath(newMazePath);
      } else {
        nextHeroTurn = getHeroNextTurn(hero, mazePath, hasEnemy, step);
      }

      setHeroTurn(nextHeroTurn);
      setMazeStep(nextHeroTurn.step);
    }

    return fields;
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

  const setState = async (token, currentLevel) => {
    const mapResource = await apiMapResource(token);
    const mapState = await apiMapState(token);
    const newCanvas = getCanvasData(mapResource, mapState, currentLevel);
    const newCanvasFields = getCanvasFields(newCanvas);

    setCanvasWidth(newCanvas.width);
    setCanvasHeight(newCanvas.height);
    setCanvasMapId(newCanvas.mapId);
    setCanvas(newCanvas);
    setCanvasFields(newCanvasFields);

    setDialogProps({ ...dialogProps, open: false });
  };

  const resetLevel = async () => {
    const {
      playthroughState: { currentLevel },
    } = await apiResetLevel(storyToken);

    setState(storyToken, currentLevel);
  };

  const nextLevel = async () => {
    const {
      playthroughState: { currentLevel },
    } = await apiNextLevel(storyToken);

    setState(storyToken, currentLevel);
  };

  const endHandler = () => {
    setNewGame(false);
  };

  const continueHandler = () => {
    resetLevel();
  };

  const nextHandler = () => {
    nextLevel();
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

  const nextTurn = async (turn) => {
    setLoadingTurn(true);

    const { didTickHappen } = await apiApproveHeroTurn(storyToken, turn);

    if (didTickHappen) {
      const { map, heroes } = await apiMapState(storyToken);

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

      const newCanvas = {
        ...canvas,
        ...updates,
      };

      setCanvas(newCanvas);

      const newCanvasFields = getCanvasFields(newCanvas);

      setCanvasFields(newCanvasFields);

      setTimeout(() => {
        setLoadingTurn(false);
      }, "300");

      if (map.isGameOver) {
        await apiPlaythroughState(storyToken);

        if (map.status === MAP_STATUS.WON) {
          setDialogProps(dialogPropsStatus[MAP_STATUS.WON]);
        } else if (map.status === MAP_STATUS.LOST) {
          setDialogProps(dialogPropsStatus[MAP_STATUS.LOST]);
        }
      }
    }
  };

  const nextTurnHandle = () => {
    nextTurn(heroTurn);
  };

  useEffect(() => {
    const fetchData = async () => {
      const {
        storyPlaythroughToken,
        playthroughState: { currentLevel },
      } = await apiStoryBegin(PLAYER_TOKEN);

      setState(storyPlaythroughToken, currentLevel);
      setStoryToken(storyPlaythroughToken);

      setTimeout(() => {
        setLoading(false);
      }, "300");
    };

    setLoading(true);
    fetchData();
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
                <Canvas
                  fields={canvasFields}
                  height={canvasHeight}
                  id={canvasMapId}
                  width={canvasWidth}
                />
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
