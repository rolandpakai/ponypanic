import Field from "./Field";
import { FIELD_TYPE } from '../utils/constants';

const Canvas = ( props ) => {
  const { fields, width, height, currentLevel, fieldSize, heroes, enemies, bullets, treasures, obstacles } = {...props};

  let canvas = [];
  
  if(fields) {

    for (let i = width-1; i >= 0; i--) {
      for (let j = 0; j < height; j++) {
        const id = `id-${j}-${i}`;

        let field = {
          position: {
            x: j,
            y: i,
          },
          size: fieldSize,
          level: currentLevel,
          type: FIELD_TYPE.FLOOR
        };

        if(heroes[id]) {
          field = heroes[id];
        } else if(treasures[id]) {
          field = treasures[id];
        } else if(obstacles[id]) {
          field = obstacles[id];
        }

        canvas.push(<Field key={id} {...field} />);

    } }
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