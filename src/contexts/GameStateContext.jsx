import React, { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { GAME_STATE, LOCAL_STORAGE_STATE_NAME } from "../utils/constants";

const defaultValue = { state: GAME_STATE.END, value: {} };

export const GameStateContext = createContext({
  gameState: defaultValue,
  updateGameState: () => {},
});

export const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = useState(defaultValue);

  const updateGameState = (prop) => {
    const { value } = prop;

    localStorage.setItem(LOCAL_STORAGE_STATE_NAME, JSON.stringify(value));

    setGameState(prop);
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
