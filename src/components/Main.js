import { useEffect, useState } from 'react';
import { mockStoryBegin, mockMapState, mockMapResource, mockApproveHeroTurn, mockMapStateAfterTurn } from '../api/api.mock';
import { FIELD_TYPE } from '../utils/constants';
import { arrayToMap, obstacleMapToArray } from '../utils/util';
import { IMG_BIG_SIZE, IMG_SMALL_SIZE } from '../utils/constants';
import Canvas from './Canvas';

const getImageSize = (mapSize) => {
  return mapSize > 10 ?  IMG_SMALL_SIZE : IMG_BIG_SIZE;
}

const Main = () => {
  const [canvas, setCanvas] = useState({});

  const [storyPlaythroughToken, setStoryPlaythroughToken] = useState('');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [elapsedTickCount, setElapsedTickCount] = useState(0);
  const [mapStatus, setMapStatus] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isCurrentLevelFinished , setIsCurrentLevelFinished] = useState(false);
  const [fieldSize, setFieldSize] = useState('64px');

  const [wait, setWait] = useState(false);

  const calcNextTurn = (heroes, treasures) => {
    console.log('calcNextTurn');

    for (const heroPositionId in heroes) {
      if (heroes.hasOwnProperty(heroPositionId)) {
        console.log(heroPositionId);
        const idd = heroPositionId;


      }
    }


  }

  const nextTurn = async () => {
    console.log('myFunc');

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
  }

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
      canvas: [],
      heroes: heroes,
      enemies: enemies,
      bullets: bullets,
      treasures: treasures,
      obstacles: obstacles,
    };


    calcNextTurn(canvas.heroes, canvas.treasures);

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
      </div>
    </main>
  )
}

export default Main;