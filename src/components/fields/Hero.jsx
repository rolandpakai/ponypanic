import React from "react";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Field from "./Field";
import { validateHeroAction } from "../../utils/util";

class Hero extends Field {
  constructor(idd, type, level, data) {
    super(idd, type, level, data);
    const { playerId, action, health, score } = data;

    this.popover = true;

    const heroAction = validateHeroAction(action).toLowerCase();
    this.imgSrc = `heroes/${heroAction}.png`;

    this.popoverContent = (
      <TableBody>
        <TableRow key={`${idd}-playerId`}>
          <TableCell align="left">Id</TableCell>
          <TableCell align="right">{playerId}</TableCell>
        </TableRow>
        <TableRow key={`${idd}-health`}>
          <TableCell align="left">Health</TableCell>
          <TableCell align="right">
            {health.toLocaleString("en", { style: "percent" })}
          </TableCell>
        </TableRow>
        <TableRow key={`${idd}-score`}>
          <TableCell align="left">Score</TableCell>
          <TableCell align="right">{score}</TableCell>
        </TableRow>
      </TableBody>
    );
  }
}

export default Hero;
