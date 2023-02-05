import React from "react";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Field from "./Field";

class Treasure extends Field {
  constructor(idd, type, level, theme, data) {
    super(idd, type, level, theme, data);
    const { name } = { ...data };

    this.imgSrc = `./themes/${theme}/treasures/treasure-${level}.png`;
    this.popover = true;

    this.popoverContent = (
      <TableBody>
        <TableRow key={`${idd}-name`}>
          <TableCell align="center">{name}</TableCell>
        </TableRow>
      </TableBody>
    );
  }
}

export default Treasure;
