import React from "react";
import Box from "@mui/material/Box";
import Footer from "./Footer";

import TitleImage from "./TitleImage";
import TitleMainMenu from "./TitleMainMenu";

const TitleScreen = () => {
  return (
    <>
      <Box>
        <TitleImage />
        <TitleMainMenu />
      </Box>
      <Footer />
    </>
  );
};

export default TitleScreen;
