import { useEffect, useState } from 'react';

import { xyTOij } from '../utils/util';
import { FIELD_TYPE, GAME_MODE, MOVE_POINTS, HERO_ACTION, PATH_REGEX } from '../utils/constants';
import Field from "./Field";
import Maze from '../maze-solver/maze2'; 

const getHeroTurnKick = (heroKicks) => {
  const heroKick = heroKicks[0];
  const newHeroTurn = {
    heroId: heroKick.id,
    action: heroKick.action,
  }

  return newHeroTurn;
}

const calcDirection = (paths) => {

  const pathLengths = paths.map((path) => {
    const ways = path.match(PATH_REGEX);
    
    const length = ways.reduce((acc, way) => {
      let stepLength = 0;
      const match = way.match(/^\d+/);
      
      if(match) {
        stepLength = parseInt(match[0], 10);
      } else {
        stepLength = 1;
      }
      
      return acc + stepLength;
    }, 0);
    
    return length;
  });
  
  const minLength = Math.min(...pathLengths);
  const minLengthIndex = pathLengths.indexOf(minLength);
  const minPath = paths[minLengthIndex];
  const firstStepInMinPath = minPath.match(PATH_REGEX)[0]
  const direction = firstStepInMinPath.charAt(firstStepInMinPath.length-1);

  return direction;
}

const getDirections = (pathsList) => {
  let directions = [];

  if(pathsList.length > 0){
    directions = pathsList.map((paths) => {
      return calcDirection(paths)
    })
  }

  return directions;
}

const getMazeDirections = (mazeArg) => {
  const maze = new Maze(mazeArg);
  const paths = maze.findPaths(true);
  console.log('paths', paths);
  const directions = getDirections(paths);

  return directions;
}

export const getHeroAction = (direction) => {
  let action = HERO_ACTION.NOTHING;

  switch (direction) {
    case 'U': {action = HERO_ACTION.MOVE_UP; break;}
    case 'D': {action = HERO_ACTION.MOVE_DOWN; break;}
    case 'L': {action = HERO_ACTION.MOVE_LEFT; break;}
    case 'R': {action = HERO_ACTION.MOVE_RIGHT; break;}
    default: action = HERO_ACTION.NOTHING;
  }

  return action;
}

const getHeroTurnMove = (mazeArg, gameMode) => {
  const directions = getMazeDirections(mazeArg);
  let newHeroTurn = {};

  if(directions.length > 0) {
    if(gameMode === GAME_MODE.STORY) {
      const direction = directions[0];
      const heroAction = getHeroAction(direction);
      const heroId = mazeArg.start[0].id;

      newHeroTurn = {
        heroId,
        action: heroAction
      }
    }
  }

  return newHeroTurn;
}

const getHeroTurn = (heroKicks, mazeArg, gameMode) => {
  let newHeroTurn = {};
  console.log('heroKick', heroKicks)
  console.log('mazeArg', mazeArg)

  if(heroKicks.length > 0) {
    newHeroTurn = getHeroTurnKick(heroKicks);
  } else {
    //newHeroTurn = getHeroTurnMove(mazeArg, gameMode);
  }

  return newHeroTurn;
}

const getHeroKickRange = (heroes, gameMode) => {
  let heroKickRange = [];

  const heroKickRanges = Object.values(heroes).map((hero) => {
    const kickPoints = MOVE_POINTS.reduce((acc, move) => {
      const point1 = { id: hero.id, x: hero.position.x + move.x, y: hero.position.y + move.y, action: move.action };
      const point2 = { id: hero.id, x: hero.position.x + move.x*2, y: hero.position.y + move.y*2, action: move.action };
      const id1 = `${point1.x}-${point1.y}`;
      const id2 = `${point2.x}-${point2.y}`;
      acc[id1] = point1;
      acc[id2] = point2;

      return acc
    }, {});

    return kickPoints;
  })

  if(heroKickRanges.length > 0) {
    if(gameMode === GAME_MODE.STORY) {
      heroKickRange = heroKickRanges[0];
    }
  }

  return heroKickRange;
}

const Canvas = ( props ) => {
  const [fields, setFields] = useState([]);
  const { width, height, fieldSize, heroes, enemies, bullets, treasures, collected, obstacles, currentLevel, gameMode, updateHeroTurn } = {...props};

  
  const addField = (x, y, fieldType, fieldSize, currentLevel, fields) => {
    const id = `${x}-${y}`;

    let field = {
      id: id,
      position: {
        x: x,
        y: y,
      },
      size: fieldSize,
      level: currentLevel,
      type: fieldType
    };

    fields.push(<Field key={id} {...field} />);
  }

  useEffect(() => {
    const fields = [];
    const start = [];
    const end = [];
    let heroKicks = {};
    const heroKick = [];
    const mazeMap = Array.from(Array(height), () => []);
    
    if(heroes) {
      const hasEnemy = !(Object.keys(enemies).length === 0);

      if(hasEnemy) {
        const heroKickRange = getHeroKickRange(heroes, gameMode);
        heroKicks = {...heroKickRange};
      }

      for (let j = -1; j <= height; j++) {
        addField(j, height, FIELD_TYPE.OBSTACLE, fieldSize, currentLevel, fields);
      }

      for (let i = width-1; i >= 0; i--) {
        for (let j = 0; j < height; j++) {
          const id = `${j}-${i}`;
          const xy = xyTOij(j, i ,height);
          mazeMap[xy.j][xy.i] = 1;

          if(j === 0) {
            addField(-1, i, FIELD_TYPE.OBSTACLE, fieldSize, currentLevel, fields);
          }

          let field = {
            id: id,
            position: {
              x: j,
              y: i,
            },
            size: fieldSize,
            level: currentLevel,
            type: FIELD_TYPE.FLOOR
          };

          if(treasures[id] && !collected[id]) {
            field = {...field, ...treasures[id]};
            end.push({ x: xy.i, y: xy.j, label: (end.length + 1000).toString(), id: field.id  })
          } 

          if(heroes[id]) {
            field = {...field, ...heroes[id]};
            start.push({ x: xy.i, y: xy.j, label: (start.length).toString(), id: field.id })
          } 

          if(enemies[id]) {
            if(enemies[id].health > 0) {
              if(heroKicks[id]) {
                heroKick.push(heroKicks[id])
              }
              field = {...field, ...enemies[id]};
            }
          } 

          if(bullets[id]) {
            field = {...field, ...bullets[id]};
          } 
          
          if(obstacles[id]) {
            field = {...field, ...obstacles[id]};
            mazeMap[xy.j][xy.i] = 0;
          } 

          fields.push(<Field key={id} {...field} />);

          if(j === width-1) {
            addField(width, i, FIELD_TYPE.OBSTACLE, fieldSize, currentLevel, fields);
          }
      } }

      for (let j = -1; j <= height; j++) {
        addField(j, -1, FIELD_TYPE.OBSTACLE, fieldSize, currentLevel, fields);
      }

      const mazeArg = {
        mazeWidth: width,
        mazeHeight: height,
        maze: mazeMap,
        start: start,
        end: end
      };

      const newHeroTurn = getHeroTurn(heroKick, mazeArg, gameMode);
      console.log('newHeroTurn', newHeroTurn)
      updateHeroTurn(newHeroTurn)
      setFields(fields);
    }
  }, [heroes, enemies, bullets]);

  const canvasStyle = {
    gridTemplateColumns: `repeat(${width + 2}, auto)`,
    //backgroundImage: `url('./themes/${theme}/maps/map-${currentLevel}/block.png')`,
    //padding: fieldSize,
  }
  
  return (
      <div className="canvas" style={ canvasStyle }>
        {
          fields 
        }
      </div>
  )
}

export default Canvas;