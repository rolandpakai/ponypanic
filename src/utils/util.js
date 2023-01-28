import { PATH_REGEX, HERO_ACTION, IMG_BIG_SIZE, IMG_SMALL_SIZE } from '../utils/constants';

export const randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const timeoutPromise = (timeout) => {
  return new Promise(resolve => {
      setTimeout(resolve, timeout);
  });
}

export const xyTOij = (x, y, height) => {
  return { i: x, j: height - y - 1 }
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
  return mapSize > 10 ?  IMG_SMALL_SIZE : IMG_BIG_SIZE;
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

export const validateHeroAction = (heroAction) => {
  let action = HERO_ACTION.MOVE_RIGHT.toLowerCase();

  if(heroAction && HERO_ACTION[heroAction]) {
    action = HERO_ACTION[heroAction].toLowerCase();
  }

  return action;
}

export const calcDirection = (paths) => {

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

export const getDirections = (pathsList) => {
  let directions = [];

  if(pathsList.length > 0){
    directions = pathsList.map((paths) => {
      return calcDirection(paths)
    })
  }

  return directions;
}
