import {
  HERO_ACTION,
  IMG_BIG_SIZE,
  IMG_SMALL_SIZE,
  KICK_POINTS,
} from "./constants";
import PathFinder from "../path-finder/PathFinder";

export const randomInteger = (min, max) =>
  min && max && Math.floor(Math.random() * (max - min + 1)) + min;

export const ijTOxy = (i, j, height) => ({ x: j, y: height - i - 1 });

export const arrayToMap = (array, type, turn) => {
  const map = {};

  array.forEach((el) => {
    const idd = `${el.position.x}-${el.position.y}`;

    el.idd = idd;
    el.type = type;

    if (turn && turn.heroId && turn.heroId === el.id && turn.action) {
      el.action = turn.action;
    }

    map[idd] = el;
  });

  return map;
};

export const mapToArray = (map) => {
  const array = [];

  const keys = Object.keys(map);

  keys.forEach((x) => {
    if (Object.prototype.hasOwnProperty.call(map, x)) {
      map[x].map((y) => array.push({ position: { x: parseInt(x, 10), y } }));
    }
  });

  return array;
};

export const getImageSize = (mapSize) => {
  if (mapSize) {
    return mapSize > 9 ? IMG_SMALL_SIZE : IMG_BIG_SIZE;
  }
  return IMG_BIG_SIZE;
};

export const validateHeroAction = (heroAction) => {
  let action = HERO_ACTION.NOTHING;

  if (heroAction && HERO_ACTION[heroAction]) {
    action = HERO_ACTION[heroAction];
  }

  return action;
};

export const getHeroAction = (direction) => {
  let action = HERO_ACTION.NOTHING;

  switch (direction) {
    case "U": {
      action = HERO_ACTION.MOVE_UP;
      break;
    }
    case "D": {
      action = HERO_ACTION.MOVE_DOWN;
      break;
    }
    case "L": {
      action = HERO_ACTION.MOVE_LEFT;
      break;
    }
    case "R": {
      action = HERO_ACTION.MOVE_RIGHT;
      break;
    }
    default:
      action = HERO_ACTION.NOTHING;
  }

  return action;
};

export const getMazePaths = (mazeArg) => {
  let paths = [];

  paths = mazeArg.endNodes.map((endNode) => {
    const arg = {
      ...mazeArg,
      startNode: mazeArg.startNodes,
      endNode,
    };

    const path = PathFinder(arg);

    if (path.length > 1) {
      path.shift();
    }

    return path;
  });

  return paths;
};

export const getShortestMazePath = (paths) => {
  let path = [];

  if (paths.length > 0) {
    if (paths.length === 1) {
      [path] = paths;
    } else {
      const pathLengths = paths.map((p) => p.length);

      const minLength = Math.min(...pathLengths);
      const minLengthIndex = pathLengths.indexOf(minLength);

      path = paths[minLengthIndex];
    }
  }

  return path;
};

export const getNextDirection = (path, step) => {
  let direction = "";

  if (path.length > 0 && path[step] && path[step].dir) {
    direction = path[step].dir;
  }

  return direction;
};

export const getHeroNextAction = (path, step) => {
  const direction = getNextDirection(path, step);
  const heroAction = getHeroAction(direction);

  return heroAction;
};

export const getHeroMazePath = (mazeArg) => {
  const paths = getMazePaths(mazeArg);
  const path = getShortestMazePath(paths);

  return path;
};

export const getHeroNextTurn = (hero, mazePath, step) => {
  let nextHeroTurn = {};

  if (hero.bulletInRange && hero.bulletInRange.length > 0) {
    const point = hero.bulletInRange[0];

    nextHeroTurn = {
      heroId: hero.id,
      action: point.action,
      step,
    };
  } else if (hero.enemyInKickRange && hero.enemyInKickRange.length > 0) {
    const point = hero.enemyInKickRange[0];

    nextHeroTurn = {
      heroId: hero.id,
      action: point.action,
      step,
    };
  } else {
    const heroAction = getHeroNextAction(mazePath, step);

    nextHeroTurn = {
      heroId: hero.id,
      action: heroAction,
      step: step + 1,
    };
  }

  return nextHeroTurn;
};

export const addPointToKickRange = (point, enemies, enemyInKickRange) => {
  if (enemies[point.idd] && enemies[point.idd].health > 0) {
    point.isEnemy = true;
    enemyInKickRange.push(point);
  }
};

export const addPointToBulletRange = (point, bullets, bulletInRange) => {
  if (bullets[point.idd]) {
    point.isBullet = true;
    point.action = HERO_ACTION.USE_SHIELD;
    bulletInRange.push(point);
  }
};

export const getHeroRanges = (hero, enemies, bullets) => {
  const enemyInKickRange = [];
  const bulletInRange = [];

  const kickRange = KICK_POINTS.reduce((acc, move) => {
    const point0 = {
      id: hero.id,
      x: hero.position.x,
      y: hero.position.y,
      action: HERO_ACTION.KICK_RIGHT,
      isEnemy: false,
      isBullet: false,
    };

    const point1 = {
      ...point0,
      action: move.action,
      x: point0.x + move.x,
      y: point0.y + move.y,
    };

    const point2 = {
      ...point0,
      action: move.action,
      x: point0.x + move.x * 2,
      y: point0.y + move.y * 2,
    };

    point0.idd = `${point0.x}-${point0.y}`;
    point1.idd = `${point1.x}-${point1.y}`;
    point2.idd = `${point2.x}-${point2.y}`;

    addPointToKickRange(point0, enemies, enemyInKickRange);
    addPointToKickRange(point1, enemies, enemyInKickRange);
    addPointToKickRange(point2, enemies, enemyInKickRange);
    addPointToBulletRange(point1, bullets, bulletInRange);

    acc[point0.idd] = point0;
    acc[point1.idd] = point1;
    acc[point2.idd] = point2;

    return acc;
  }, {});

  return { kickRange, enemyInKickRange, bulletInRange };
};
