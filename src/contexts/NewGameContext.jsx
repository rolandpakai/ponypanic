import React, { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

export const NewGameContext = createContext({
  newGame: false,
  setNewGame: () => {},
});

export const NewGameProvider = ({ children }) => {
  const [newGame, setNewGame] = useState(false);

  const value = useMemo(() => ({ newGame, setNewGame }), [newGame]);

  return (
    <NewGameContext.Provider value={value}>{children}</NewGameContext.Provider>
  );
};

NewGameProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
