const Canvas = ( {id, width, height, fields} ) => {

  const canvasStyle = {
    gridTemplateColumns: `repeat(${width + 2}, auto)`,
  }
  
  return (
      <div id={`id-${id}`} className="canvas" style={ canvasStyle }>
        {
          fields 
        }
      </div>
  )
}

export default Canvas;