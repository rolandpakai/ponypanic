import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";

import Table from "@mui/material/Table";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { ThemeContext } from "../contexts/ThemeContext";
import { FIELD_TYPE, THEME_MAP_COUNT } from "../utils/constants";

const FieldContainer = (props) => {
  const [anchorEl, setAnchorEl] = useState();
  const { theme } = useContext(ThemeContext);
  const { idd, size, type, level, field } = { ...props };

  const open = Boolean(anchorEl);

  const fieldLevel = level > THEME_MAP_COUNT ? THEME_MAP_COUNT : level;

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const imgStyle = {
    width: size,
    height: size,
    backgroundRepeat: "no-repeat",
    margin: "auto",
    src: "",
  };

  return (
    <>
      <Box
        id={`field-${idd}`}
        aria-owns={
          field.hasPopover() && open ? "mouse-over-popover" : undefined
        }
        aria-haspopup="true"
        onMouseEnter={field.hasPopover() ? handlePopoverOpen : undefined}
        onMouseLeave={field.hasPopover() ? handlePopoverClose : undefined}
        sx={{
          width: size,
          height: size,
          display: "flex",
          backgroundSize: size,
          backgroundRepeat: "no-repeat",
          backgroundImage: `url('./themes/${theme}/maps/map-${fieldLevel}/floor.png')`,
        }}
      >
        {type !== FIELD_TYPE.FLOOR && (
          <img
            alt={type}
            src={`./themes/${theme}/${field.getImgSrc()}`}
            style={imgStyle}
          />
        )}
      </Box>
      {field.hasPopover() && (
        <Popover
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          disableRestoreFocus
          id="mouse-over-popover"
          onClose={handlePopoverClose}
          open={open}
          sx={{
            pointerEvents: "none",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <TableContainer>
            <Table
              aria-label="simple table"
              size="small"
              sx={{
                [`& .${tableCellClasses.root}`]: {
                  borderBottom: "none",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}>
                    {type}
                  </TableCell>
                </TableRow>
              </TableHead>
              {field.getPopoverContent()}
            </Table>
          </TableContainer>
        </Popover>
      )}
    </>
  );
};

export default FieldContainer;
