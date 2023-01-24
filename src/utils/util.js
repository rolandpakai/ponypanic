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

export const arrayToMap = (array, size, level, type) => {
  const map = {};

  array.forEach((el) => {
    const idd = `id-${el.position.x}-${el.position.y}`;
    el.size = size;
    el.level = level;
    el.type = type;

    map[idd] = el;
  });

  return map;
}

export const obstacleMapToArray = (map) => {
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
    const id = `id-${el.position.x}-${el.position.y}`;
    el.type = type;
    map[id] = el;
  })
}