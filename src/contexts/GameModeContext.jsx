import React, { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { GAME_MODE } from "../utils/constants";

export const GameModeContext = createContext({
  gameMode: GAME_MODE.UNDEFINED,
  setGameMode: () => {},
});

export const GameModeProvider = ({ children }) => {
  const [gameMode, setGameMode] = useState(GAME_MODE.UNDEFINED);

  const value = useMemo(() => ({ gameMode, setGameMode }), [gameMode]);

  return (
    <GameModeContext.Provider value={value}>
      {children}
    </GameModeContext.Provider>
  );
};

GameModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
