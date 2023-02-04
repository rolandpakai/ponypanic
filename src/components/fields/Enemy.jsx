import React from "react";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Field from "./Field";

class Enemy extends Field {
  constructor(idd, type, action, level, theme, data) {
    super(idd, action, level, theme, data);
    const {
      id,
      moveProbability,
      shootProbability,
      onTouchDamage,
      bulletDamage,
      health,
    } = { ...data };

    this.popover = true;

    this.imgStyleSrc = `./themes/${theme}/enemies/${type.toLowerCase()}-${level}.png`;

    this.popoverContent = (
      <TableBody>
        <TableRow key={`${idd}-id`}>
          <TableCell align="left">Id</TableCell>
          <TableCell align="right">{id}</TableCell>
        </TableRow>
        <TableRow key={`${idd}-health`}>
          <TableCell align="left">Health</TableCell>
          <TableCell align="right">
            {health.toLocaleString("en", { style: "percent" })}
          </TableCell>
        </TableRow>
        <TableRow key={`${idd}-moveProbability`}>
          <TableCell align="left">Move Probability</TableCell>
          <TableCell align="right">
            {moveProbability.toLocaleString("en", { style: "percent" })}
          </TableCell>
        </TableRow>
        <TableRow key={`${idd}-shootProbability`}>
          <TableCell align="left">Shoot Probability</TableCell>
          <TableCell align="right">
            {shootProbability.toLocaleString("en", { style: "percent" })}
          </TableCell>
        </TableRow>
        <TableRow key={`${idd}-bulletDamage`}>
          <TableCell align="left">Bullet Damage</TableCell>
          <TableCell align="right">
            {bulletDamage.toLocaleString("en", { style: "percent" })}
          </TableCell>
        </TableRow>
        <TableRow key={`${idd}-onTouchDamage`}>
          <TableCell align="left">Touch Damage</TableCell>
          <TableCell align="right">
            {onTouchDamage.toLocaleString("en", { style: "percent" })}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
}

export default Enemy;
