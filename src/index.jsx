import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GameStateProvider } from "./contexts/GameStateContext";
import { GameModeProvider } from "./contexts/GameModeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <GameStateProvider>
        <GameModeProvider>
          <App />
        </GameModeProvider>
      </GameStateProvider>
    </ThemeProvider>
  </React.StrictMode>
);
