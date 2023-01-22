import { useEffect, useState } from 'react';
import { mockStoryBegin, mockMapState, mockMapResource } from './Map.test';
import { FIELD_TYPE } from '../utils/constants';
import Canvas from './Canvas';


const Main = () => {
  const [canvas, setCanvas] = useState({});
  const [storyPlaythroughToken, setStoryPlaythroughToken] = useState('');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [elapsedTickCount, setElapsedTickCount] = useState(0);
  const [mapStatus, setMapStatus] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isCurrentLevelFinished , setIsCurrentLevelFinished] = useState(false);

  const addEntityToMap = (map, array, type) => {
    array.forEach((el) => {
      const id = `id-${el.position.x}-${el.position.y}`;
      el.type = type;
      map[id] = el;
    })
  }

  useEffect(() => {

    const {storyPlaythroughToken, playthroughState: {currentLevel, isCurrentLevelFinished} } = mockStoryBegin;
    const { map, heroes } = mockMapState;
    const { compressedObstacles: {coordinateMap} } = mockMapResource;

    setStoryPlaythroughToken(storyPlaythroughToken);
    setCurrentLevel(currentLevel);
    setIsCurrentLevelFinished(isCurrentLevelFinished);
    setElapsedTickCount(map.elapsedTickCount);
    setMapStatus(map.status);
    setIsGameOver(map.isGameOver);

    const obstacles = [];
    for (const x in coordinateMap) {
      if (coordinateMap.hasOwnProperty(x)) {
        coordinateMap[x].map((y) => obstacles.push({position: {x, y}}))
      }
    }

    const canvas = {
      width: map.width,
      height: map.height,
      level: currentLevel,
      fields: {},
    };

    for (let i = map.width-1; i >= 0; i--) {
      for (let j = 0; j < map.height; j++) {
        const id = `id-${j}-${i}`;

        canvas.fields[id] = {
          position: {
            x: j,
            y: i,
          },
          type: FIELD_TYPE.FLOOR
        };
    } }

    addEntityToMap(canvas.fields, heroes, FIELD_TYPE.HERO);
    addEntityToMap(canvas.fields, map.treasures, FIELD_TYPE.TREASURE);
    addEntityToMap(canvas.fields, obstacles, FIELD_TYPE.OBSTACLE);

    setCanvas(canvas);

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