import React, { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { GAME_STATE } from "../utils/constants";

export const GameStateContext = createContext({
  gameState: false,
  updateGameState: () => {},
});

export const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = useState(GAME_STATE.OVER);

  const updateGameState = (state) => {
    setGameState(state);
  };

  const value = useMemo(() => ({ gameState, updateGameState }), [gameState]);

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

GameStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
