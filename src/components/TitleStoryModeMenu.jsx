import React, { useContext } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { GameStateContext } from "../contexts/GameStateContext";
import { GAME_STATE } from "../utils/constants";
import Button from "./Button";

const TitleContainerModeMenu = () => {
  const { updateGameState } = useContext(GameStateContext);

  const onClickNewGameHandler = () => {
    updateGameState(GAME_STATE.NEW);
  };

  const onClickContinueHandler = () => {
    updateGameState(GAME_STATE.NEW);
  };

  return (
    <Container maxWidth="xs">
      <Stack direction="row" justifyContent="center" p="10px" maxWidth="xs">
        <Button onClick={onClickNewGameHandler}>NEW GAME</Button>
      </Stack>
      <Stack direction="row" justifyContent="center" p="10px" maxWidth="xs">
        <Button onClick={onClickContinueHandler}>CONTINUE</Button>
      </Stack>
    </Container>
  );
};

export default TitleContainerModeMenu;
