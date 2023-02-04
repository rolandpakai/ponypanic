import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { ThemeContext } from "../contexts/ThemeContext";

const Header = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <Box>
      <Container maxWidth="md">
        <Stack
          direction="row"
          justifyContent="center"
          maxWidth="xs"
          sx={{
            padding: "2rem",
          }}
        >
          <img
            alt="title"
            className="header-img"
            src={`./themes/${theme}/title.png`}
            style={{
              display: "block",
              height: "110px",
              objectFit: "contain",
            }}
          />
        </Stack>
      </Container>
    </Box>
  );
};

export default Header;
