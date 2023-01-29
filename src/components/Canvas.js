import { useEffect } from 'react';

const Canvas = ( {id, width, height, fields} ) => {

  useEffect(() => {

  }, []);

  const canvasStyle = {
    gridTemplateColumns: `repeat(${width + 2}, auto)`,
  }
  
  return (
      <div className="canvas" style={ canvasStyle }>
        {
          fields 
        }
      </div>
  )
}

export default Canvas;