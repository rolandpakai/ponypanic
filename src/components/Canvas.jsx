import React from "react";
import Box from "@mui/material/Box";

const Canvas = (props) => {
  const { id, width, fields } = { ...props };

  return (
    <Box
      id={`id-${id}`}
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${width + 2}, auto)`,
      }}
    >
      {fields}
    </Box>
  );
};

export default Canvas;
