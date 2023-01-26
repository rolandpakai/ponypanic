import { Fragment, useEffect, useState, useContext } from 'react';

import { NewGameContext } from '../contexts/NewGameContext';
import { apiStoryBegin, apiMapResource, apiMapState, apiApproveHeroTurn, apiPlaythroughState, apiResetLevel, apiNextLevel } from '../api/api';
import { PLAYER_TOKEN, FIELD_TYPE, MAP_STATUS } from '../utils/constants';
import { arrayToMap, obstacleMapToArray, calcDirection, getHeroAction, getImageSize } from '../utils/util';
import Maze from '../maze-solver/maze'; 
import Canvas from './Canvas';
import PopupDialog from './PopupDialog';
import CustomButton from './CustomButton';

const MapContainer = () => {
  const { newGame, setNewGame } = useContext(NewGameContext);

  const [canvas, setCanvas] = useState({});
  //const [maze, setMaze] = useState({});
  const [storyPlaythroughToken, setStoryPlaythroughToken] = useState('');
  /*
  const [currentLevel, setCurrentLevel] = useState(0);
  const [elapsedTickCount, setElapsedTickCount] = useState(0);
  const [mapStatus, setMapStatus] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isCurrentLevelFinished , setIsCurrentLevelFinished] = useState(false);
  const [fieldSize, setFieldSize] = useState('64px');
*/
  const [heroTurn, setHeroTurn] = useState({});
  const [dialogProps, setDialogProps] = useState({open:false});

  const updateMaze = (mazeArg) => {
    console.log('mazeArg', mazeArg)
    const maze = new Maze(mazeArg);
    const paths = maze.findPaths(true);
    console.log('paths',paths);
    const direction = calcDirection(paths);
    const heroAction = getHeroAction(direction);
    console.log(direction);
    const heroId = mazeArg.start[0].id;
    //console.log("heroId",heroId);

    const newHeroTurn = {
      storyPlaythroughToken,
      heroId,
      action: heroAction
    }

    //setMaze(maze);
    setHeroTurn(newHeroTurn);
  }

  const getCanvasData = (mapResource, mapState, currentLevel) => {
    const { mapId, compressedObstacles: {coordinateMap} } = mapResource;
    const { map, heroes } = mapState;

    const size = getImageSize(map.width);
    const obstaclesList = obstacleMapToArray(coordinateMap);
    const heroesList = arrayToMap(heroes, FIELD_TYPE.HERO);
    const treasures = arrayToMap(map.treasures, FIELD_TYPE.TREASURE);
    const obstacles = arrayToMap(obstaclesList, FIELD_TYPE.OBSTACLE);

    const enemies = {};
    const bullets = {};

    return {
      mapId: mapId,
      width: map.width,
      height: map.height,
      fieldSize: size,
      heroes: heroesList,
      enemies: enemies,
      bullets: bullets,
      treasures: treasures,
      obstacles: obstacles,
      updateMaze: updateMaze,
      currentLevel: currentLevel,
    };

  }

  const resetLevel = async (storyPlaythroughToken) => {
    const { playthroughState: {currentLevel, isCurrentLevelFinished, currentMapStatus} } = await apiResetLevel(storyPlaythroughToken);
    const mapResource= await apiMapResource(storyPlaythroughToken);
    const mapState = await apiMapState(storyPlaythroughToken);

    const newCanvas = getCanvasData(mapResource, mapState)
    newCanvas.currentLevel = currentLevel;

    setCanvas(newCanvas);
  }

  const nextLevel = async (storyPlaythroughToken) => {
    const { playthroughState: {currentLevel, isCurrentLevelFinished, currentMapStatus} } = await apiNextLevel(storyPlaythroughToken);
    const mapResource = await apiMapResource(storyPlaythroughToken);
    const mapState = await apiMapState(storyPlaythroughToken);

    const newCanvas = getCanvasData(mapResource, mapState, currentLevel)
    //newCanvas.currentLevel = currentLevel;

    setDialogProps({...dialogProps, open: false});
    //setCanvas(newCanvas);

    /*setCanvas({
      ...newCanvas
    });*/

    //setCanvas(newCanvas);

    console.log('newCanvas.obstacles', newCanvas.obstacles)

    setCanvas({
      ...canvas,
      mapId: newCanvas.mapId,
      width: newCanvas.width,
      height: newCanvas.height,
      fieldSize: newCanvas.fieldSize,
      heroes: newCanvas.heroes,
      enemies: newCanvas.enemies,
      bullets: newCanvas.bullets,
      treasures: newCanvas.treasures,
      obstacles: newCanvas.obstacles,
      currentLevel: newCanvas.currentLevel,
    });
  }

  const endHandler = () => {
    console.log('endHandler');
    setNewGame(false);
  };

  const continueHandler = async () => {
    console.log('continueHandler')
    await resetLevel(storyPlaythroughToken);
  };

  const nextHandler = () => {
    console.log('nextHandler')
    nextLevel(storyPlaythroughToken);
  };

  const dialogPropsStatus = {
    'LOST': {
      open: true,
      dialogContentText: 'GAME OVER',
      buttonOkText: 'CONTINUE',
      buttonCancelText: 'END', 
      okHandler: continueHandler,
      cancelHandler: endHandler,
    },
    'WON': {
      open: true,
      dialogContentText: 'CONGRATULATION',
      buttonOkText: 'NEXT LEVEL',
      buttonCancelText: 'END', 
      okHandler: nextHandler,
      cancelHandler: endHandler,
    },
  };

  const nextTurn = async (heroTurn) => {
    const { didTickHappen, message, tickLogs } = await apiApproveHeroTurn(heroTurn)
    console.log('didTickHappen', didTickHappen);

    if(didTickHappen) {
      const { map, heroes } = await apiMapState(storyPlaythroughToken);

      if(map.isGameOver) {
        //setIsGameOver(map.isGameOver); 
        const {currentLevel, currentMapStatus, isCurrentLevelFinished} = await apiPlaythroughState(storyPlaythroughToken);
        
        if(map.status === MAP_STATUS.WON) {
          setDialogProps(dialogPropsStatus[MAP_STATUS.WON]);
        } else if(map.status === MAP_STATUS.LOST) {
          setDialogProps(dialogPropsStatus[MAP_STATUS.LOST]);
        }
      } else {
        //MAP_STATUS.CRATED || MAP_STATUS.PLAYING
        const heroesList = arrayToMap(heroes, FIELD_TYPE.HERO);
        const enemies = {};
        const bullets = {};
  
        setCanvas({
          ...canvas,
          heroes: heroesList,
          enemies: enemies,
          bullets: bullets,
        });
      }
    }
  }

  //For Testing
  const handleClickOpen = () => {

    setDialogProps(dialogPropsStatus[MAP_STATUS.WON]);
         
  };

  const nextTurnHandle = () => {
    console.log('CLICK')
    heroTurn.storyPlaythroughToken = storyPlaythroughToken;

    //handleClickOpen();
    nextTurn(heroTurn);
  }

  useEffect(() => {

    const fetchData = async () => {
      const {storyPlaythroughToken, playthroughState: {currentLevel, isCurrentLevelFinished, currentMapStatus} } = await apiStoryBegin(PLAYER_TOKEN);
      
      //const { mapId, compressedObstacles: {coordinateMap} } = await apiMapResource(storyPlaythroughToken);
      //const { map, heroes } = await apiMapState(storyPlaythroughToken);
      const mapResource = await apiMapResource(storyPlaythroughToken);
      const mapState = await apiMapState(storyPlaythroughToken);
      
      const canvas = getCanvasData(mapResource, mapState, currentLevel)
      //canvas.currentLevel = currentLevel;

      /*const size = getImageSize(map.width);
      const obstaclesList = obstacleMapToArray(coordinateMap);
      const heroesList = arrayToMap(heroes, size, currentLevel, FIELD_TYPE.HERO);
      const treasures = arrayToMap(map.treasures, size, currentLevel, FIELD_TYPE.TREASURE);
      const obstacles = arrayToMap(obstaclesList, size, currentLevel, FIELD_TYPE.OBSTACLE);

      const enemies = {};
      const bullets = {};*/

      /*const canvas = {
        mapId: mapId,
        width: map.width,
        height: map.height,
        currentLevel: currentLevel,
        fieldSize: size,
        fields: {},
        heroes: heroesList,
        enemies: enemies,
        bullets: bullets,
        treasures: treasures,
        obstacles: obstacles,
        updateMaze: updateMaze
      };*/

      setStoryPlaythroughToken(storyPlaythroughToken);
      //setCurrentLevel(currentLevel);
      //setIsCurrentLevelFinished(isCurrentLevelFinished);

     /* setElapsedTickCount(map.elapsedTickCount);
      setMapStatus(map.status);
      setIsGameOver(map.isGameOver);
      setFieldSize(size);*/

      setCanvas(canvas);
    }

    fetchData();
  }, []);

  return (
    <Fragment>   
      <main className="main">
        <div className="main-container">
          <div className="sub-container">
            <div className="panel-left">
                <Canvas 
                  {...canvas}
                />
            </div>
          </div>
          <CustomButton onClick={nextTurnHandle} title={"HERO TURN"}/>
        </div>
      </main>
      <PopupDialog {...dialogProps} />
    </Fragment>
  )
}

export default MapContainer;