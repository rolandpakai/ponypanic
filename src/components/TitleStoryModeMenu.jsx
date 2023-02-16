import React, { useContext, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { GameStateContext } from "../contexts/GameStateContext";
import {
  existsItemInLocalStorage,
  getItemFromLocalStorage,
} from "../utils/util";
import { GAME_STATE, LOCAL_STORAGE_STATE_NAME } from "../utils/constants";
import Button from "./Button";

const TitleStoryModeMenu = () => {
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

  useEffect(() => {
    const exists = existsItemInLocalStorage(LOCAL_STORAGE_STATE_NAME);

    if (exists) {
      const storedState = getItemFromLocalStorage(LOCAL_STORAGE_STATE_NAME);
      const newGameState = {
        ...gameState,
        value: storedState,
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

export default TitleStoryModeMenu;
