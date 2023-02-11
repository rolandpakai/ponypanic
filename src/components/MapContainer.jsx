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
  getHeroRanges,
  getHeroMazePath,
  getHeroNextTurn,
  getImageSize,
  mapToArray,
  ijTOxy,
} from "../utils/util";
import {
  BORDER,
  FIELD_TYPE,
  GAME_MODE,
  MAP_COUNT,
  PLAYER_TOKEN,
} from "../utils/constants";
import { Algorithms, Heuristic } from "../path-finder/constants";
import Canvas from "./Canvas";
import PopupDialog from "./PopupDialog";
import Button from "./Button";
import FieldContainer from "./FieldContainer";

import Bullet from "./fields/Bullet";
import Enemy from "./fields/Enemy";
import Hero from "./fields/Hero";
import Obstacle from "./fields/Obstacle";
import Treasure from "./fields/Treasure";
import Field from "./fields/Field";

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

  const addField = (fieldContainer, fields) => {
    fields.push(
      <FieldContainer
        key={fieldContainer.idd}
        idd={fieldContainer.idd}
        level={fieldContainer.level}
        position={fieldContainer.position}
        size={fieldContainer.size}
        type={fieldContainer.type}
        field={fieldContainer.field}
      />
    );
  };

  const addBorderField = (x, y, fieldType, fieldSize, level, fields) => {
    const idd = `${x}-${y}`;

    const fieldContainer = {
      idd,
      position: {
        x,
        y,
      },
      size: fieldSize,
      level,
      type: fieldType,
      field: new Obstacle(idd, fieldType, level, {}),
    };

    addField(fieldContainer, fields);
  };

  const addBorderFields = (
    height,
    borderLocation,
    fieldType,
    fieldSize,
    level,
    fields
  ) => {
    const borderRow = borderLocation === BORDER.TOP ? height : -1;

    for (let j = -1; j <= height; j += 1) {
      addBorderField(j, borderRow, fieldType, fieldSize, level, fields);
    }
  };

  const isNewMazePath = (hero, collected, elapsedTickCount) => {
    return (
      elapsedTickCount === 0 ||
      (collected[hero.idd] && collected[hero.idd].collectedByHeroId === hero.id)
    );
  };

  const storyGameMode = (
    startNodes,
    endNodes,
    heroes,
    collected,
    maze,
    width,
    height,
    step,
    elapsedTickCount
  ) => {
    const startNode = startNodes[0];
    const hero = heroes[startNode.idd];

    let stepNr = step;

    let newMazePath = [...mazePath];

    if (isNewMazePath(hero, collected, elapsedTickCount)) {
      stepNr = 0;
    }

    if (stepNr === 0) {
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

      newMazePath = getHeroMazePath(mazeArg);
    }

    const nextHeroTurn = getHeroNextTurn(hero, newMazePath, stepNr);

    setMazePath(newMazePath);
    setHeroTurn(nextHeroTurn);
    setMazeStep(nextHeroTurn.step);
  };

  const getStep = (elapsedTickCount) => {
    return elapsedTickCount === 0 ? elapsedTickCount : mazeStep;
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
    const fieldLevel = currentLevel > MAP_COUNT ? MAP_COUNT : currentLevel;

    addBorderFields(
      height,
      BORDER.TOP,
      FIELD_TYPE.OBSTACLE,
      fieldSize,
      fieldLevel,
      fields
    );

    for (let i = width - 1; i >= 0; i -= 1) {
      for (let j = 0; j < height; j += 1) {
        const idd = `${j}-${i}`;
        const xy = ijTOxy(i, j, height);

        maze[xy.y][xy.x] = 0;

        if (j === 0) {
          addBorderField(
            -1,
            i,
            FIELD_TYPE.OBSTACLE,
            fieldSize,
            fieldLevel,
            fields
          );
        }

        let fieldContainer = {
          idd,
          position: {
            x: j,
            y: i,
          },
          size: fieldSize,
          level: fieldLevel,
          type: FIELD_TYPE.FLOOR,
          field: new Field(idd, FIELD_TYPE.FLOOR, fieldLevel, {}),
        };

        if (treasures[idd] && !collected[idd]) {
          fieldContainer = {
            ...fieldContainer,
            type: treasures[idd].type,
            field: new Treasure(
              idd,
              treasures[idd].type,
              fieldLevel,
              treasures[idd]
            ),
          };
          endNodes.push({ x: xy.x, y: xy.y, id: fieldContainer.id, idd });
        }

        if (heroes[idd]) {
          if (hasEnemy) {
            const { kickRange, enemyInKickRange, bulletInRange } =
              getHeroRanges(heroes[idd], enemies, bullets);

            heroes[idd].kickRange = kickRange;
            heroes[idd].enemyInKickRange = enemyInKickRange;
            heroes[idd].bulletInRange = bulletInRange;
          }

          fieldContainer = {
            ...fieldContainer,
            type: heroes[idd].type,
            field: new Hero(idd, heroes[idd].type, fieldLevel, heroes[idd]),
          };

          startNodes.push({ x: xy.x, y: xy.y, id: fieldContainer.id, idd });
        }

        if (enemies[idd] && enemies[idd].health > 0) {
          fieldContainer = {
            ...fieldContainer,
            type: enemies[idd].type,
            field: new Enemy(idd, enemies[idd].type, fieldLevel, enemies[idd]),
          };
        }

        if (bullets[idd]) {
          fieldContainer = {
            ...fieldContainer,
            type: bullets[idd].type,
            field: new Bullet(idd, bullets[idd].type, fieldLevel, bullets[idd]),
          };
        }

        if (enemies[idd] && bullets[idd]) {
          fieldContainer = {
            ...fieldContainer,
            type: FIELD_TYPE.ENEMY_BULLET,
            field: new Enemy(
              idd,
              FIELD_TYPE.ENEMY_BULLET,
              fieldLevel,
              enemies[idd]
            ),
          };
        }

        if (obstacles[idd]) {
          fieldContainer = {
            ...fieldContainer,
            type: obstacles[idd].type,
            field: new Obstacle(
              idd,
              obstacles[idd].type,
              fieldLevel,
              obstacles[idd]
            ),
          };
          maze[xy.y][xy.x] = 2;
        }

        addField(fieldContainer, fields);

        if (j === width - 1) {
          addBorderField(
            width,
            i,
            FIELD_TYPE.OBSTACLE,
            fieldSize,
            fieldLevel,
            fields
          );
        }
      }
    }

    addBorderFields(
      height,
      BORDER.BOTTOM,
      FIELD_TYPE.OBSTACLE,
      fieldSize,
      fieldLevel,
      fields
    );

    const step = getStep(elapsedTickCount);

    if (gameMode === GAME_MODE.STORY) {
      storyGameMode(
        startNodes,
        endNodes,
        heroes,
        collected,
        maze,
        width,
        height,
        step,
        elapsedTickCount
      );
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

    setCanvas(newCanvas);

    const newCanvasFields = getCanvasFields(newCanvas);

    setCanvasFields(newCanvasFields);

    setTimeout(() => {
      setLoadingTurn(false);
    }, "300");

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
