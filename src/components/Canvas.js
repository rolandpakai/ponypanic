import Field from "./Field";
import { IMG_BIG_SIZE, IMG_SMALL_SIZE } from '../utils/constants';

const getImageSize = (mapSize) => {
  return mapSize > 10 ?  IMG_SMALL_SIZE : IMG_BIG_SIZE;
}

const Canvas = ( props ) => {
  const { level, fields, width, height } = {...props};

  let size = getImageSize(width);

  let canvas = [];
  
  if(fields) {
    for (let i = width-1; i >= 0; i--) {
      for (let j = 0; j < height; j++) {
        const id = `id-${j}-${i}`;
        const field = fields[id];
        field.level = level;
        field.size = size;

        canvas.push(<Field key={id} {...field} />);
    }}
  }

  const canvasStyle = {
    gridTemplateColumns: `repeat(${width}, auto)`
  }
  
  return (
      <div className="canvas" style={ canvasStyle }>
        {
          canvas 
        }
      </div>
  )
}

export default Canvas;