import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";

import {
  getHeroRanges,
  getHeroMazePath,
  getHeroNextTurn,
  ijTOxy,
} from "../utils/util";
import { BORDER, FIELD_TYPE, GAME_MODE, MAP_COUNT } from "../utils/constants";
import { Algorithms, Heuristic } from "../path-finder/constants";

import FieldContainer from "./FieldContainer";

import Bullet from "./fields/Bullet";
import Enemy from "./fields/Enemy";
import Hero from "./fields/Hero";
import Obstacle from "./fields/Obstacle";
import Treasure from "./fields/Treasure";
import Field from "./fields/Field";

const Canvas = (props) => {
  const [gameMode] = useState(GAME_MODE.STORY);
  const [canvasFields, setCanvasFields] = useState([]);
  const [mazePath, setMazePath] = useState([]);

  const { canvas, updateHeroTurn } = { ...props };

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
    elapsedTickCount
  ) => {
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

  const getCanvasFields = () => {
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

    if (gameMode === GAME_MODE.STORY) {
      storyGameMode(
        startNodes,
        endNodes,
        heroes,
        collected,
        maze,
        width,
        height,
        elapsedTickCount
      );
    }

    return fields;
  };

  useEffect(() => {
    if (!(Object.keys(canvas).length === 0))
      setCanvasFields(getCanvasFields(canvas));
  }, [canvas]);

  return (
    <Box
      id={`id-${canvas.mapId}`}
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${canvas.width + 2}, auto)`,
      }}
    >
      {canvasFields}
    </Box>
  );
};

export default Canvas;
