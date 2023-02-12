import React, { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { GAME_MODE } from "../utils/constants";

export const GameModeContext = createContext({
  gameMode: GAME_MODE.UNDEFINED,
  updateGameMode: () => {},
});

export const GameModeProvider = ({ children }) => {
  const [gameMode, setGameMode] = useState(GAME_MODE.UNDEFINED);

  const updateGameMode = (mode) => {
    setGameMode(mode);
  };

  const value = useMemo(() => ({ gameMode, updateGameMode }), [gameMode]);

  return (
    <GameModeContext.Provider value={value}>
      {children}
    </GameModeContext.Provider>
  );
};

GameModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
