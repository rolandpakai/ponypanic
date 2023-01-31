import { HERO_ACTION, IMG_BIG_SIZE, IMG_SMALL_SIZE } from '../utils/constants';
import { KICK_POINTS} from '../utils/constants';
import PathFinder from '../path-finder/PathFinder';

export const randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const timeoutPromise = (timeout) => {
  return new Promise(resolve => {
      setTimeout(resolve, timeout);
  });
}

export const xyTOij = (x, y, height) => {
  return { i: height - x - 1, j: y}
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
  
  paths = mazeArg.endNodes.map((endNode) => {
    const arg = {
      ...mazeArg,
      startNode: mazeArg.startNodes,
      endNode: endNode,
    }
    const path = PathFinder(arg);

    if(path.length > 1) {
      path.shift();
    }

    return path;
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
    direction = path[step].dir;
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
  const path = getShortestMazePath(paths);

  return path;
}

export const getHeroNextTurn = (hero, mazePath, hasEnemy, step) => {
  let nextHeroTurn = {};

  if(hasEnemy && hero.bulletInRange && hero.bulletInRange.length > 0) {
    const point = hero.bulletInRange[0];

    nextHeroTurn = {
      heroId: hero.id,
      action: point.action,
      step: step,
    }

  } else if(hasEnemy && hero.enemyInKickRange && hero.enemyInKickRange.length > 0) {
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

export const getHeroKickRange = (hero, enemies, bullets) => {
  const enemyInKickRange = [];
  const bulletInRange = [];

  const kickRange = KICK_POINTS.reduce((acc, move) => {
    const point1 = { id: hero.id, x: hero.position.x + move.x, y: hero.position.y + move.y, action: move.action, isEnemy: false, isBullet: false };
    const point2 = { id: hero.id, x: hero.position.x + move.x*2, y: hero.position.y + move.y*2, action: move.action, isEnemy: false, isBullet: false };
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

    if(bullets[id1]) {
      point1.isBullet = true;
      point1.action = HERO_ACTION.USE_SHIELD
      bulletInRange.push(point1);
    }

    acc[id1] = point1;
    acc[id2] = point2;

    return acc
  }, {});

  return { kickRange, enemyInKickRange, bulletInRange };
}

export const localStorageGetItem = (itemName) => {
  return localStorage.getItem(itemName)
}

export const localStorageSetItem = (itemName, itemValue) => {
  return localStorage.setItem(itemName, itemValue)
}