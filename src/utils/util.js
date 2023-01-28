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
  return mapSize > 9 ?  IMG_SMALL_SIZE : IMG_BIG_SIZE;
}

export const validateHeroAction = (heroAction) => {
  let action = HERO_ACTION.MOVE_RIGHT.toLowerCase();

  if(heroAction && HERO_ACTION[heroAction]) {
    action = HERO_ACTION[heroAction].toLowerCase();
  }

  return action;
}
