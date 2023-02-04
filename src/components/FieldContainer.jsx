import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";

import Table from "@mui/material/Table";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { ThemeContext } from "../contexts/ThemeContext";
import { FIELD_TYPE, MAP_COUNT } from "../utils/constants";

import Bullet from "./fields/Bullet";
import Enemy from "./fields/Enemy";
import Hero from "./fields/Hero";
import Obstacle from "./fields/Obstacle";
import Treasure from "./fields/Treasure";
import Field from "./fields/Field";

const FieldContainer = (props) => {
  const [anchorEl, setAnchorEl] = useState();
  const { theme } = useContext(ThemeContext);
  const { idd, size, action, type, level, data } = { ...props };

  const open = Boolean(anchorEl);

  const mapLevel = level > MAP_COUNT ? MAP_COUNT : level;

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

  let field;

  switch (type) {
    case FIELD_TYPE.HERO: {
      field = new Hero(idd, type, action, level, theme, data);
      break;
    }
    case FIELD_TYPE.ENEMY:
    case FIELD_TYPE.ENEMY_BULLET: {
      field = new Enemy(idd, type, action, level, theme, data);
      break;
    }
    case FIELD_TYPE.BULLET: {
      field = new Bullet(idd, type, action, level, theme, data);
      break;
    }
    case FIELD_TYPE.TREASURE: {
      field = new Treasure(idd, type, action, level, theme, data);
      break;
    }
    case FIELD_TYPE.OBSTACLE: {
      field = new Obstacle(idd, type, action, level, theme, data);
      break;
    }
    default:
      field = new Field(idd, type, action, level, theme, data);
    // imgStyle.backgroundImage = "";
  }

  return (
    <>
      <Box
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
          backgroundImage: `url('./themes/${theme}/maps/map-${mapLevel}/floor.png')`,
        }}
      >
        {type !== FIELD_TYPE.FLOOR && (
          <img alt={type} src={field.getImgStyleSrc()} style={imgStyle} />
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
