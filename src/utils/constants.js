export const PLAYER_TOKEN = process.env.REACT_APP_PLAYER_TOKEN; 
// "760_I1ljZlZXWmUsSH0sVzNvajVmQH4yc11oUiQpPmNoLlVzUCQiSkh+aEY=";

export const TREASURE_COUNT = 9;
export const MAP_COUNT = 11;
export const IMG_BIG_SIZE = '64px';
export const IMG_SMALL_SIZE = '32px';
export const DEFAULT_THEME = 'pony';
export const PATH_REGEX = /(\d*[UDRL]|[UDRL])/g;

export const THEMES_SELECT_OPTIONS = [
  { value: 'pony', label: 'Pony' },
  { value: 'zelda', label: 'Zelda' },
]

export const MAP_STATUS = {
  CREATED: 'CREATED',
  PLAYING: 'PLAYING',
  WON: 'WON',
  LOST: 'LOST',
}

export const HERO_ACTION = {
  NOTHING: 'NOTHING',
  USE_SHIELD: 'USE_SHIELD',

  MOVE_LEFT: 'MOVE_LEFT',
  MOVE_RIGHT: 'MOVE_RIGHT',
  MOVE_UP: 'MOVE_UP',
  MOVE_DOWN: 'MOVE_DOWN',

  KICK_LEFT: 'KICK_LEFT',
  KICK_RIGHT: 'KICK_RIGHT',
  KICK_UP: 'KICK_UP',
  KICK_DOWN: 'KICK_DOWN',
}

export const HERO_STATE = {
  STAND: 'stand', 
  SHILD: 'shild',
  ATTACK: 'attack',
}

export const HERO_MOVE = {
  LEFT: 'left', 
  SHILD: 'right',
  UP: 'up',
  DOWN: 'down',
}

export const FIELD_TYPE = {
  HERO: 'HERO',
  TREASURE: 'TREASURE',
  ENEMY: 'ENEMY',
  BULLET: 'BULLET',
  OBSTACLE: 'OBSTACLE',
  FLOOR: 'FLOOR',
}