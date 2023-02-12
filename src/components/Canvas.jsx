import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";

import {
  getHeroRanges,
  getHeroMazePath,
  getHeroNextTurn,
  ijTOxy,
} from "../utils/util";
import {
  BORDER,
  FIELD_TYPE,
  GAME_MODE,
  THEME_MAP_COUNT,
} from "../utils/constants";
import { Algorithms, Heuristic } from "../path-finder/constants";
import FieldContainer from "./FieldContainer";
import Bullet from "./fields/Bullet";
import Enemy from "./fields/Enemy";
import Hero from "./fields/Hero";
import Obstacle from "./fields/Obstacle";
import Treasure from "./fields/Treasure";
import Field from "./fields/Field";
import { GameModeContext } from "../contexts/GameModeContext";

const Canvas = (props) => {
  const { gameMode } = useContext(GameModeContext);
  const [fields, setFields] = useState([]);
  const [mazePath, setMazePath] = useState([]);

  const { canvas, updateHeroTurn } = { ...props };

  const getFieldContainer = (fieldContainer) => {
    return (
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

  const getBorderField = (x, y, fieldType, fieldSize, level) => {
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

    return getFieldContainer(fieldContainer);
  };

  const getBorderFields = (
    height,
    borderLocation,
    fieldType,
    fieldSize,
    level
  ) => {
    const borderFields = [];
    const borderRow = borderLocation === BORDER.TOP ? height : -1;

    for (let j = -1; j <= height; j += 1) {
      borderFields.push(
        getBorderField(j, borderRow, fieldType, fieldSize, level)
      );
    }

    return borderFields;
  };

  const getFields = () => {
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
    } = canvas;

    let newFields = [];
    const startNodes = [];
    const endNodes = [];
    const maze = Array.from(Array(height), () => []);
    const hasEnemy = !(Object.keys(enemies).length === 0);
    const fieldLevel =
      currentLevel > THEME_MAP_COUNT ? THEME_MAP_COUNT : currentLevel;

    let borderFields = getBorderFields(
      height,
      BORDER.TOP,
      FIELD_TYPE.OBSTACLE,
      fieldSize,
      fieldLevel
    );

    newFields = newFields.concat(borderFields);

    for (let i = width - 1; i >= 0; i -= 1) {
      for (let j = 0; j < height; j += 1) {
        const idd = `${j}-${i}`;
        const xy = ijTOxy(i, j, height);

        maze[xy.y][xy.x] = 0;

        if (j === 0) {
          newFields.push(
            getBorderField(-1, i, FIELD_TYPE.OBSTACLE, fieldSize, fieldLevel)
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

        newFields.push(getFieldContainer(fieldContainer));

        if (j === width - 1) {
          newFields.push(
            getBorderField(width, i, FIELD_TYPE.OBSTACLE, fieldSize, fieldLevel)
          );
        }
      }
    }

    borderFields = getBorderFields(
      height,
      BORDER.BOTTOM,
      FIELD_TYPE.OBSTACLE,
      fieldSize,
      fieldLevel
    );

    newFields = newFields.concat(borderFields);

    const gameParam = {
      startNodes,
      endNodes,
      heroes,
      collected,
      maze,
      width,
      height,
      elapsedTickCount,
    };

    return { newFields, gameParam };
  };

  const isNewMazePath = (hero, collected, elapsedTickCount) => {
    return (
      elapsedTickCount === 0 ||
      (collected[hero.idd] && collected[hero.idd].collectedByHeroId === hero.id)
    );
  };

  const storyGameMode = (gameParam) => {
    const {
      startNodes,
      endNodes,
      heroes,
      collected,
      maze,
      width,
      height,
      elapsedTickCount,
    } = gameParam;

    const startNode = startNodes[0];
    const hero = heroes[startNode.idd];

    let newMazePath = [...mazePath];

    if (isNewMazePath(hero, collected, elapsedTickCount)) {
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

    const nextHeroTurn = getHeroNextTurn(hero, newMazePath);

    setMazePath(nextHeroTurn.mazePath);
    updateHeroTurn(nextHeroTurn);
  };

  const playGame = (gameParam) => {
    if (gameMode === GAME_MODE.STORY) {
      storyGameMode(gameParam);
    }
  };

  useEffect(() => {
    if (!(Object.keys(canvas).length === 0)) {
      const { newFields, gameParam } = getFields(canvas);

      playGame(gameParam);
      setFields(newFields);
    }
  }, [canvas]);

  return (
    <Box
      id={`id-${canvas.mapId}`}
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${canvas.width + 2}, auto)`,
      }}
    >
      {fields}
    </Box>
  );
};

export default Canvas;
