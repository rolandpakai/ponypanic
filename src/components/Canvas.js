import { useEffect, useState } from 'react';

import { xyTOij } from '../utils/util';
import { FIELD_TYPE, GAME_MODE, KICK_POINTS, HERO_ACTION } from '../utils/constants';
import Field from "./Field";
import Maze from '../maze-solver/maze'; 

const getHeroTurnKick = (heroKicks) => {
  const heroKick = heroKicks[0];
  const newHeroTurn = {
    heroId: heroKick.id,
    action: heroKick.action,
  }

  return newHeroTurn;
}

const getHeroAction = (direction) => {
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

const getMazePaths = (mazeArg) => {
  let paths = [];
  
  paths = mazeArg.end.map((end) => {
    const maze = [...mazeArg.maze];
    maze[end.x][end.y] = 2; 
    
    const arg = {
      start: [mazeArg.start.x, mazeArg.start.y],
      end: [end.x, end.y],
      maze: maze,
    }
    
    const result = Maze(arg);
    const path = result[0];

    if(path.length > 1) {
      path.shift();
    }

    const steps = path.map((step) => {
      return step[0];
    })

    return steps;
  })
 
  return paths;
}

const getShortestMazePath = (paths) => {
  let path = [];

  if(paths.length > 0) {
    if(paths.length === 1) {
      path = paths[0];
    } else {
      const pathLengths = paths.map((path) => {
        return path.length;
      })

      const minLength = Math.min(...pathLengths);
      const minLengthIndex = pathLengths.indexOf(minLength);
      path = paths[minLengthIndex];
    }
  }

  return path;

}

const getDirection = (path) => {
  let direction = '';

  if(path.length > 0){
    direction = path[0];
  }

  return direction;
}

const getHeroTurnMove = (mazeArg) => {
  
  const paths = getMazePaths(mazeArg);
  const path = getShortestMazePath(paths);
  const direction = getDirection(path);
  const heroAction = getHeroAction(direction);
  
  const heroTurn = {
    heroId: mazeArg.id,
    action: heroAction
  }

  return heroTurn;
}

const getHeroTurn = (heroKicks, mazeArg) => {
  let newHeroTurn = {};

  if(heroKicks.length > 0) {
    newHeroTurn = getHeroTurnKick(heroKicks);
  } else {
    newHeroTurn = getHeroTurnMove(mazeArg);
  }

  return newHeroTurn;
}

const getHeroKickRange = (heroes, gameMode) => {
  let heroKickRange = [];

  const heroKickRanges = Object.values(heroes).map((hero) => {
    const kickPoints = KICK_POINTS.reduce((acc, move) => {
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
    let start = [];
    const end = [];
    let heroKicks = {};
    const heroKick = [];
    const maze = Array.from(Array(height), () => []);
    
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
          const xy = xyTOij(i, j ,height);
          maze[xy.i][xy.j] = 0;

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
            end.push({ x: xy.i, y: xy.j, id: field.id })
          } 

          if(heroes[id]) {
            field = {...field, ...heroes[id]};
            start.push({ x: xy.i, y: xy.j, id: field.id })
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

          if(enemies[id] && bullets[id]) {
            field = {...field, ...enemies[id], type: FIELD_TYPE.ENEMY_BULLET};
          } 
          
          if(obstacles[id]) {
            field = {...field, ...obstacles[id]};
            maze[xy.i][xy.j] = 1;
          } 

          fields.push(<Field key={id} {...field} />);

          if(j === width-1) {
            addField(width, i, FIELD_TYPE.OBSTACLE, fieldSize, currentLevel, fields);
          }
      } }

      for (let j = -1; j <= height; j++) {
        addField(j, -1, FIELD_TYPE.OBSTACLE, fieldSize, currentLevel, fields);
      }

      if(gameMode === GAME_MODE.STORY) {
        start = start[0];
      }

      const mazeArg = {
        maze: maze,
        start: start,
        end: end,
      };
      console.log('mazeArg', mazeArg)
      const newHeroTurn = getHeroTurn(heroKick, mazeArg);

      updateHeroTurn(newHeroTurn)
      setFields(fields);
    }
  }, [heroes, enemies, bullets]);

  const canvasStyle = {
    gridTemplateColumns: `repeat(${width + 2}, auto)`,
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