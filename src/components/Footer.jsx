import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import { ThemeContext } from "../contexts/ThemeContext";
import { THEMES_SELECT_OPTIONS } from "../utils/constants";

const Footer = () => {
  const { theme, selectTheme } = useContext(ThemeContext);

  const handleChange = (event) => {
    selectTheme(event.target.value);
  };

  return (
    <Box className="footer">
      <Box
        sx={{
          float: "left",
          padding: "0 5px 5px 5px",
        }}
      >
        <ul>
          <li>
            <Link
              color="inherit"
              href="https://www.linkedin.com/in/roland-p%C3%A1kai-6a2041249/"
              target="_blank"
            >
              <LinkedInIcon fontSize="medium" />
            </Link>
          </li>
          <li>
            <Link
              color="inherit"
              href="https://github.com/rolandpakai/ponypanic"
              target="_blank"
            >
              <GitHubIcon fontSize="medium" />
            </Link>
          </li>
        </ul>
      </Box>
      <Box
        sx={{
          float: "right",
          padding: "0 5px 5px 5px",
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
