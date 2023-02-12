import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Footer from "./Footer";

import { ThemeContext } from "../contexts/ThemeContext";
import TitleMainMenu from "./TitleMainMenu";

const TitleScreen = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <Box>
        <Container maxWidth="md">
          <Box
            justifyContent="center"
            sx={{
              height: "550px",
              padding: "2rem",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundImage: `url('./themes/${theme}/title-screen.png')`,
            }}
          />
        </Container>
        <TitleMainMenu />
      </Box>
      <Footer />
    </>
  );
};

export default TitleScreen;
