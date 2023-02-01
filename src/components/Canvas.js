import Box from '@mui/material/Box';
const Canvas = ( {id, width, height, fields} ) => {

  return (
      <Box 
        id={`id-${id}`} 
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${width + 2}, auto)`,
        }}
      >
        {
          fields 
        }
      </Box>
  )
}

export default Canvas;