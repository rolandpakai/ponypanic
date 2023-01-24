import { useEffect, useState } from 'react';
import Field from "./Field";
import { HERO_ACTION, FIELD_TYPE, PATH_REGEX } from '../utils/constants';
import { xyTOij } from '../utils/util';
import Maze from '../maze-solver/maze'; 

const Canvas = ( props ) => {
  const [fields, setFields] = useState([]);
  const { width, height, currentLevel, fieldSize, heroes, enemies, bullets, treasures, obstacles, updateMaze } = {...props};

  //Performance 
  const calcDirection = (pathsList) => {
    let direction = '';

    if(pathsList.length > 0){
      //Hero-0
      const paths = pathsList[0];
      
      /*const pathSteps = paths[0].map((p) => {
        return p.match(PATH_REGEX);
      });*/
      
      const pathLengths = paths.map((path) => {
        const ways = path.match(PATH_REGEX);
        
        const length = ways.reduce((acc, way) => {
          let stepLength = 0;
          const match = way.match(/^\d+/);
          
          if(match) {
            stepLength = parseInt(match[0], 10);
          } else {
            stepLength = 1;
          }
          
          return acc + stepLength;
        }, 0);
        
        return length;
      });
      
      const minLength = Math.min(...pathLengths);
      const minLengthIndex = pathLengths.indexOf(minLength);
      const minPath = paths[minLengthIndex];
      const firstStepInMinPath = minPath.match(PATH_REGEX)[0]
      
      direction = firstStepInMinPath.charAt(firstStepInMinPath.length-1);
    }

    return direction;
  }

  const calcMaze = (width, height, mazeMap, start, end) => {
    const mazeArg = {
      mazeWidth: width,
      mazeHeight: height,
      maze: mazeMap,
      start: start,
      end: end
    };
    //console.log('mazeArg',mazeArg);

    const maze = new Maze(mazeArg);
    const paths = maze.findPaths(true);
    console.log('paths',paths);

    const direction = calcDirection(paths);
    console.log(direction)

    //setMaze(maze);
  }

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
          //const xy = xyTOij(field.position.x, field.position.y, height);
          start.push({ x: xy.i, y: xy.j, label: start.length })
        } else if(treasures[id]) {
          field = treasures[id];
          //const xy = xyTOij(field.position.x, field.position.y, height);
          end.push({ x: xy.i, y: xy.j, label: end.length + 1000 })
        } else if(obstacles[id]) {
          field = obstacles[id];
          //console.log(xyTOij(field.position.x, field.position.y, height))
          mazeMap[xy.j][xy.i] = 0;
        } 

        fields.push(<Field key={id} {...field} />);

    } }

    //console.log(mazeMap);
    calcMaze(width, height, mazeMap, start, end);

    setFields(fields);
    }
  }, [heroes]);

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