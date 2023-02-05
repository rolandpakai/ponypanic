export const PLAYER_TOKEN = process.env.REACT_APP_PLAYER_TOKEN;
export const ENEMY_COUNT = 5;
export const TREASURE_COUNT = 9;
export const MAP_COUNT = 11;
export const KICK_DAMAGE = 0.6;
export const IMG_BIG_SIZE = "64px";
export const IMG_SMALL_SIZE = "32px";
export const DEFAULT_THEME = "pony";
export const LOCAL_STORAGE_THEME_NAME = "pony-panic-theme";

export const GAME_MODE = {
  STORY: "STORY",
  FREESTYLE: "FREESTYLE",
};

export const THEMES_SELECT_OPTIONS = [
  { value: "pony", label: "Pony" },
  { value: "zelda", label: "Zelda" },
];

export const MAP_STATUS = {
  CREATED: "CREATED",
  PLAYING: "PLAYING",
  WON: "WON",
  LOST: "LOST",
};

export const HERO_ACTION = {
  NOTHING: "NOTHING",
  USE_SHIELD: "USE_SHIELD",

  MOVE_LEFT: "MOVE_LEFT",
  MOVE_RIGHT: "MOVE_RIGHT",
  MOVE_UP: "MOVE_UP",
  MOVE_DOWN: "MOVE_DOWN",

  KICK_LEFT: "KICK_LEFT",
  KICK_RIGHT: "KICK_RIGHT",
  KICK_UP: "KICK_UP",
  KICK_DOWN: "KICK_DOWN",
};

export const FIELD_TYPE = {
  HERO: "HERO",
  TREASURE: "TREASURE",
  ENEMY: "ENEMY",
  BULLET: "BULLET",
  ENEMY_BULLET: "ENEMY_BULLET",
  OBSTACLE: "OBSTACLE",
  FLOOR: "FLOOR",
  COLLECTED_TREASURE: "COLLECTED_TREASURE",
};

export const BORDER = {
  TOP: "TOP",
  BOTTOM: "BOTTOM0",
};

export const KICK_POINTS = [
  { x: 0, y: 1, action: HERO_ACTION.KICK_DOWN },
  { x: 0, y: -1, action: HERO_ACTION.KICK_UP },
  { x: 1, y: 0, action: HERO_ACTION.KICK_RIGHT },
  { x: -1, y: 0, action: HERO_ACTION.KICK_LEFT },
];
