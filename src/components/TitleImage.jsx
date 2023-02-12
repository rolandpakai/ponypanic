import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { ThemeContext } from "../contexts/ThemeContext";

const TitleImage = () => {
  const { theme } = useContext(ThemeContext);

  return (
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
  );
};

export default TitleImage;
