import React, { useContext } from "react";
import { GameModeContext } from "../contexts/GameModeContext";
import { GAME_MODE } from "../utils/constants";
import TitleContainerModeMenu from "./TitleContainerModeMenu";
import TitleContainerStoryModeMenu from "./TitleContainerStoryModeMenu";

const TitleContainerMainMenu = () => {
  const { gameMode } = useContext(GameModeContext);

  if (gameMode === GAME_MODE.STORY) {
    return <TitleContainerStoryModeMenu />;
  }

  return <TitleContainerModeMenu />;
};

export default TitleContainerMainMenu;
