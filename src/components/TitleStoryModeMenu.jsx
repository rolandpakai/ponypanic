import React, { useContext, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { GameStateContext } from "../contexts/GameStateContext";
import { GAME_STATE, LOCAL_STORAGE_STATE_NAME } from "../utils/constants";
import Button from "./Button";

const TitleContainerModeMenu = () => {
  const { gameState, updateGameState } = useContext(GameStateContext);
  const [gameStateStored, setGameStateStored] = useState(false);

  const onClickNewGameHandler = () => {
    const newGameState = {
      state: GAME_STATE.NEW,
    };

    updateGameState(newGameState);
  };

  const onClickContinueHandler = () => {
    const newGameState = {
      ...gameState,
      state: GAME_STATE.CONTINUE,
    };
    updateGameState(newGameState);
  };

  const existsGameStateInStore = () => {
    let exists = false;
    const localStorageState = localStorage.getItem(LOCAL_STORAGE_STATE_NAME);

    if (localStorageState && localStorageState !== "undefined") {
      exists = true;
    }

    return exists;
  };

  useEffect(() => {
    const exists = existsGameStateInStore();

    if (exists) {
      const localStorageState = localStorage.getItem(LOCAL_STORAGE_STATE_NAME);
      const storageState = JSON.parse(localStorageState);
      const newGameState = {
        ...gameState,
        value: storageState,
      };

      updateGameState(newGameState);
    }

    setGameStateStored(exists);
  }, []);

  return (
    <Container maxWidth="xs">
      <Stack direction="row" justifyContent="center" p="10px" maxWidth="xs">
        <Button onClick={onClickNewGameHandler}>NEW GAME</Button>
      </Stack>
      <Stack direction="row" justifyContent="center" p="10px" maxWidth="xs">
        <Button disabled={!gameStateStored} onClick={onClickContinueHandler}>
          CONTINUE
        </Button>
      </Stack>
    </Container>
  );
};

export default TitleContainerModeMenu;
