import { useEffect, useState } from 'react';
import Field from "./Field";
import { HERO_ACTION, FIELD_TYPE, PATH_REGEX } from '../utils/constants';
import { xyTOij } from '../utils/util';
import Maze from '../maze-solver/maze'; 

const Canvas = ( props ) => {
  const [fields, setFields] = useState([]);
  const { width, height, currentLevel, fieldSize, heroes, enemies, bullets, treasures, obstacles, updateMaze } = {...props};

  const heroAction = (direction) => {
    let action = HERO_ACTION.NOTHING;

    switch (direction) {
      case 'U': {action = HERO_ACTION.UP; break;}
      case 'D': {action = HERO_ACTION.DOWN; break;}
      case 'L': {action = HERO_ACTION.LEFT; break;}
      case 'R': {action = HERO_ACTION.RIGHT; break;}
      default: action = HERO_ACTION.NOTHING;
    }

    return action;
  }

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
            start.push({ x: xy.i, y: xy.j, label: start.length })
          } else if(treasures[id]) {
            field = treasures[id];
            end.push({ x: xy.i, y: xy.j, label: end.length + 1000 })
          } else if(obstacles[id]) {
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
    gridTemplateColumns: `repeat(${width}, auto)`
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