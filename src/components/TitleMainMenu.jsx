import React, { useContext } from "react";
import { GameModeContext } from "../contexts/GameModeContext";
import { GAME_MODE } from "../utils/constants";
import TitleModeMenu from "./TitleModeMenu";
import TitleStoryModeMenu from "./TitleStoryModeMenu";

const TitleMainMenu = () => {
  const { gameMode } = useContext(GameModeContext);

  if (gameMode === GAME_MODE.STORY) {
    return <TitleStoryModeMenu />;
  }

  return <TitleModeMenu />;
};

export default TitleMainMenu;
