import { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import Field from "./Field";
import { FIELD_TYPE } from '../utils/constants';
import { xyTOij } from '../utils/util';

const Canvas = ( props ) => {
  const { theme } = useContext(ThemeContext);
  const [fields, setFields] = useState([]);
  const { width, height, currentLevel, fieldSize, heroes, enemies, bullets, treasures, obstacles, updateMaze } = {...props};

  useEffect(() => {
    const fields = [];
    const mazeMap = Array.from(Array(height), () => []);
    const start = [];
    const end = [];

    if(heroes) {

      for (let i = width-1; i >= 0; i--) {
        for (let j = 0; j < height; j++) {
          const id = `id-${j}-${i}`;
          const xy = xyTOij(j, i ,height);
          mazeMap[xy.j][xy.i] = 1;

          let field = {
            id: id,
            position: {
              x: j,
              y: i,
            },
            size: fieldSize,
            level: currentLevel,
            type: FIELD_TYPE.FLOOR
          };

          if(treasures[id]) {
            field = treasures[id];
            end.push({ x: xy.i, y: xy.j, label: end.length + 1000, id: field.id  })
          } 
          
          if(heroes[id]) {
            field = heroes[id];
            start.push({ x: xy.i, y: xy.j, label: start.length, id: field.id })
          } 
          
          if(obstacles[id]) {
            field = obstacles[id];
            mazeMap[xy.j][xy.i] = 0;
          } 

          fields.push(<Field key={id} {...field} />);
      } }

      const mazeArg = {
        mazeWidth: width,
        mazeHeight: height,
        maze: mazeMap,
        start: start,
        end: end
      };
      //console.log(mazeMap);
      //calcMaze(mazeArg);
      updateMaze(mazeArg);

      setFields(fields);
    }
  }, [heroes, enemies, bullets]);

  const canvasStyle = {
    gridTemplateColumns: `repeat(${width}, auto)`,
    //backgroundImage: `url('./themes/${theme}/maps/map-${currentLevel}/block.png')`,
    //padding: fieldSize,
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