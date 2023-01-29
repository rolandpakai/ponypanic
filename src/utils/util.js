import { HERO_ACTION, IMG_BIG_SIZE, IMG_SMALL_SIZE } from '../utils/constants';
import { KICK_POINTS} from '../utils/constants';
import Maze from '../maze-solver/maze'; 

export const randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const timeoutPromise = (timeout) => {
  return new Promise(resolve => {
      setTimeout(resolve, timeout);
  });
}

export const xyTOij = (x, y, height) => {
  return { i: height - x - 1, j: y }
}

export const arrayToMap = (array, type, turn) => {
  const map = {};

  array.forEach((el) => {
    const idd = `${el.position.x}-${el.position.y}`;
    el.type = type;

    if(turn && turn.heroId && turn.heroId === el.id) {
      el.action = turn.action;
    }

    map[idd] = el;
  });

  return map;
}

export const mapToArray = (map) => {
  const array = [];
  
  for (const x in map) {
    if (map.hasOwnProperty(x)) {
      map[x].map((y) => array.push({position: {x, y}}))
    }
  }

  return array;
}

export const addEntityToMap = (map, array, type) => {
  array.forEach((el) => {
    const idd = `${el.position.x}-${el.position.y}`;
    el.type = type;
    map[idd] = el;
  })
}

export const getImageSize = (mapSize) => {
  return mapSize > 9 ?  IMG_SMALL_SIZE : IMG_BIG_SIZE;
}

export const validateHeroAction = (heroAction) => {
  let action = HERO_ACTION.MOVE_RIGHT.toLowerCase();

  if(heroAction && HERO_ACTION[heroAction]) {
    action = HERO_ACTION[heroAction].toLowerCase();
  }

  return action;
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

export const getMazePaths = (mazeArg) => {
  let paths = [];
  
  paths = mazeArg.ends.map((end) => {
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

export const getShortestMazePath = (paths) => {
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

export const getNextDirection = (path, step) => {
  let direction = '';

  if(path.length > 0){
    direction = path[step];
  }

  return direction;
}

export const getHeroNextAction = (path, step) => {
  const direction = getNextDirection(path, step);
  const heroAction = getHeroAction(direction);

  return heroAction;
}

export const getHeroMazePath = (mazeArg) => {
  const paths = getMazePaths(mazeArg);
  console.log('paths', paths);
  const path = getShortestMazePath(paths);
  console.log('path', path);

  return path;
}

export const getHeroNextTurn = (hero, mazePath, hasEnemy, step) => {
  let nextHeroTurn = {};

  if(hasEnemy && hero.enemyInKickRange && hero.enemyInKickRange.length > 0) {
    const point = hero.enemyInKickRange[0];

    nextHeroTurn = {
      heroId: hero.id,
      action: point.action,
      step: step,
    }
  } else {
    const heroAction = getHeroNextAction(mazePath, step);

    nextHeroTurn = {
      heroId: hero.id,
      action: heroAction,
      step: step + 1,
     }
  }

  return nextHeroTurn;
}

export const getHeroKickRange = (hero, enemies) => {
  const enemyInKickRange = [];

  const kickRange = KICK_POINTS.reduce((acc, move) => {
    const point1 = { id: hero.id, x: hero.position.x + move.x, y: hero.position.y + move.y, action: move.action, isEnemy: false };
    const point2 = { id: hero.id, x: hero.position.x + move.x*2, y: hero.position.y + move.y*2, action: move.action, isEnemy: false };
    const id1 = `${point1.x}-${point1.y}`;
    const id2 = `${point2.x}-${point2.y}`;

    if(enemies[id1] && enemies[id1].health > 0) {
      point1.isEnemy = true;
      enemyInKickRange.push(point1);
    }

    if(enemies[id2] && enemies[id2].health > 0) {
      point2.isEnemy = true;
      enemyInKickRange.push(point2);
    }

    acc[id1] = point1;
    acc[id2] = point2;

    return acc
  }, {});

  return { kickRange, enemyInKickRange };
}