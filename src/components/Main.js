import { useEffect, useState } from 'react';
import { mockStoryBegin, mockMapState, mockMapResource, mockApproveHeroTurn, mockMapStateAfterTurn } from '../api/api.mock';
import { FIELD_TYPE, PATH_REGEX} from '../utils/constants';
import { arrayToMap, obstacleMapToArray, xyTOij } from '../utils/util';
import { IMG_BIG_SIZE, IMG_SMALL_SIZE } from '../utils/constants';
import Maze from '../maze-solver/maze'; 
import Canvas from './Canvas';

const getImageSize = (mapSize) => {
  return mapSize > 10 ?  IMG_SMALL_SIZE : IMG_BIG_SIZE;
}

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

const Main = () => {
  const [canvas, setCanvas] = useState({});
  const [maze, setMaze] = useState({});

  const [storyPlaythroughToken, setStoryPlaythroughToken] = useState('');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [elapsedTickCount, setElapsedTickCount] = useState(0);
  const [mapStatus, setMapStatus] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isCurrentLevelFinished , setIsCurrentLevelFinished] = useState(false);
  const [fieldSize, setFieldSize] = useState('64px');

  const [wait, setWait] = useState(false);


  const nextTurn = () => {

  
  }

  const nextTurnHandle = () => {
    console.log('CLICK')

    const paths = maze.findPaths(true);
    //console.log('paths',paths);
    const direction = calcDirection(paths);
    console.log(direction);
  }

  const updateMaze = (mazeArg) => {
    //console.log('mazeArg', mazeArg)

    const maze = new Maze(mazeArg);
    setMaze(maze);

    /*
    const paths = maze.findPaths(true);
    //console.log('paths',paths);

    const direction = calcDirection(paths);
    console.log(direction)*/
  }

  /*const nextTurn = async () => {

    //calcNextTurn(heroes);

    const { didTickHappen } = mockApproveHeroTurn;

    if(didTickHappen) {
      const {map, heroes} = mockMapStateAfterTurn;

      if(map.isGameOver) {
        setIsGameOver(map.isGameOver); //Level over
        //Popup: Congratulation: Reset Level | Next Level
      } else {
        const newHeroes = arrayToMap(heroes, fieldSize, currentLevel, FIELD_TYPE.HERO);
        canvas.heroes = newHeroes;

        setCanvas(canvas);
        //setWait(true);
      }
    }

    return new Promise((resolve, reject) => {
      return resolve('resolve')
    })
  }*/

  useEffect(() => {
    console.log('wait', wait);

    /*const interval = setInterval(() => {
        nextTurn().then((resolve) => {
          setWait(true);
        }
        )
    }, 5000);

    return () => {
        clearInterval(interval);
        setWait(false);
    }*/
   
   }, [wait]);

  useEffect(() => {
    const {storyPlaythroughToken, playthroughState: {currentLevel, isCurrentLevelFinished} } = mockStoryBegin;
    const { map } = mockMapState;
    const { compressedObstacles: {coordinateMap} } = mockMapResource;
    const size = getImageSize(map.width);

    setStoryPlaythroughToken(storyPlaythroughToken);
    setCurrentLevel(currentLevel);
    setIsCurrentLevelFinished(isCurrentLevelFinished);
    setElapsedTickCount(map.elapsedTickCount);
    setMapStatus(map.status);
    setIsGameOver(map.isGameOver);
    setFieldSize(size);

    const obstaclesList = obstacleMapToArray(coordinateMap);
    const heroes = arrayToMap(mockMapState.heroes, size, currentLevel, FIELD_TYPE.HERO);
    const treasures = arrayToMap(map.treasures, size, currentLevel, FIELD_TYPE.TREASURE);
    const obstacles = arrayToMap(obstaclesList, size, currentLevel, FIELD_TYPE.OBSTACLE);

    const enemies = {};
    const bullets = {};

    const canvas = {
      width: map.width,
      height: map.height,
      currentLevel: currentLevel,
      fieldSize: size,
      fields: {},
      heroes: heroes,
      enemies: enemies,
      bullets: bullets,
      treasures: treasures,
      obstacles: obstacles,
      updateMaze: updateMaze
    };

    setCanvas(canvas);
    //setWait(true);
  }, []);

  return (
    <main className="main">
      <div className="main-container">
        <div className="sub-container">
          <div className="panel-left">
              <Canvas 
                {...canvas}
              />
          </div>
        </div>
        <button onClick={nextTurnHandle}>NEXT TURN</button>
      </div>
    </main>
  )
}

export default Main;