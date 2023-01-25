import { createContext, useState } from "react";

export const NewGameContext = createContext({
  newGame: false, 
  setNewGame: () => {},
});

export const NewGameProvider = ({ children }) => {
  const [newGame, setNewGame] = useState(false);

  const value = {
    newGame, 
    setNewGame,
  }

  return (
    <NewGameContext.Provider value={ value }>
      {children}
    </NewGameContext.Provider>
  );
};