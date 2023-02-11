import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Stack from "@mui/material/Stack";

import { ThemeContext } from "../contexts/ThemeContext";
import { THEMES_SELECT_OPTIONS } from "../utils/constants";

const Footer = () => {
  const { theme, selectTheme } = useContext(ThemeContext);

  const handleChange = (event) => {
    selectTheme(event.target.value);
  };

  return (
    <Box
      sx={{
        width: "100%",
        bottom: "0",
        position: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          p: "5px",
        }}
      >
        <Stack direction="row" spacing={1}>
          <Link
            color="inherit"
            href="https://www.linkedin.com/in/roland-p%C3%A1kai-6a2041249/"
            target="_blank"
          >
            <LinkedInIcon fontSize="large" />
          </Link>
          <Link
            color="inherit"
            href="https://github.com/rolandpakai/ponypanic"
            target="_blank"
          >
            <GitHubIcon fontSize="large" />
          </Link>
        </Stack>
      </Box>
      <Box
        sx={{
          p: "5px",
        }}
      >
        <Select onChange={handleChange} value={theme}>
          {THEMES_SELECT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

export default Footer;
