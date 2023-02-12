import React, { useContext } from "react";

import { GameStateContext } from "./contexts/GameStateContext";
import MapScreen from "./components/MapScreen";
import TitleScreen from "./components/TitleScreen";
import { GAME_STATE } from "./utils/constants";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./styles/App.scss";

const App = () => {
  const { gameState } = useContext(GameStateContext);

  if (gameState === GAME_STATE.OVER) {
    return <TitleScreen />;
  }

  return <MapScreen />;
};

export default App;
