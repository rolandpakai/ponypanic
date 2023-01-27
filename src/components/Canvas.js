import { useEffect, useState, useContext } from 'react';

import { ThemeContext } from '../contexts/ThemeContext';
import { FIELD_TYPE, GAME_MODE } from '../utils/constants';
import { xyTOij, getDirections, getHeroAction } from '../utils/util';
import Field from "./Field";
import Maze from '../maze-solver/maze'; 

const Canvas = ( props ) => {
  const { theme } = useContext(ThemeContext);
  const [fields, setFields] = useState([]);
  const { width, height, fieldSize, heroes, enemies, bullets, treasures, collected, obstacles, currentLevel, gameMode, updateHeroTurn } = {...props};

  const updateMaze = (mazeArg) => {
    console.log('mazeArg', mazeArg)
    const maze = new Maze(mazeArg);
    const paths = maze.findPaths(true);
    console.log('Maze path', paths)
    const directions = getDirections(paths);

    if(directions.length > 0) {
      if(gameMode === GAME_MODE.STORY) {
        const direction = directions[0];
        const heroAction = getHeroAction(direction);
        console.log(direction);
        const heroId = mazeArg.start[0].id;

        const newHeroTurn = {
          heroId,
          action: heroAction
        }
        updateHeroTurn(newHeroTurn)
      }
    }
  }

  useEffect(() => {
    const fields = [];
    const mazeMap = Array.from(Array(height), () => []);
    const start = [];
    const end = [];

    if(heroes) {

      console.log('collected', collected)
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

          if(treasures[id] && !collected[id]) {
            field = {...field, ...treasures[id]};
            end.push({ x: xy.i, y: xy.j, label: (end.length + 1000).toString(), id: field.id  })
          } 

          if(heroes[id]) {
            field = {...field, ...heroes[id]};
            start.push({ x: xy.i, y: xy.j, label: (start.length).toString(), id: field.id })
          } 

          if(enemies[id]) {
            field = {...field, ...enemies[id]};
          } 

          if(bullets[id]) {
            field = {...field, ...bullets[id]};
          } 
          
          if(obstacles[id]) {
            field = {...field, ...obstacles[id]};
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