import React, { useContext } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { GameModeContext } from "../contexts/GameModeContext";
import { GAME_MODE } from "../utils/constants";
import Button from "./Button";

const TitleContainerModeMenu = () => {
  const { setGameMode } = useContext(GameModeContext);

  const onClickStoryModeHandler = () => {
    setGameMode(GAME_MODE.STORY);
  };

  const onClickFreestyleModeHandler = () => {
    setGameMode(GAME_MODE.FREESTYLE);
  };

  return (
    <Container maxWidth="xs">
      <Stack direction="row" justifyContent="center" p="10px" maxWidth="xs">
        <Button onClick={onClickStoryModeHandler}>STORY MODE</Button>
      </Stack>
      <Stack direction="row" justifyContent="center" p="10px" maxWidth="xs">
        <Button onClick={onClickFreestyleModeHandler} disabled>
          FREESTYLE MODE
        </Button>
      </Stack>
    </Container>
  );
};

export default TitleContainerModeMenu;
