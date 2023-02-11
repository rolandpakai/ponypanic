import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NewGameProvider } from "./contexts/NewGameContext";
import { GameModeProvider } from "./contexts/GameModeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <NewGameProvider>
        <GameModeProvider>
          <App />
        </GameModeProvider>
      </NewGameProvider>
    </ThemeProvider>
  </React.StrictMode>
);
