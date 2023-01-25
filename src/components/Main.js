import { Fragment, useEffect, useState } from 'react';
import { apiStoryBegin, apiMapResource, apiMapState, apiApproveHeroTurn, apiPlaythroughState } from '../api/api';
import { PLAYER_TOKEN, FIELD_TYPE, MAP_STATUS } from '../utils/constants';
import { arrayToMap, obstacleMapToArray, calcDirection, getHeroAction, getImageSize } from '../utils/util';
import Maze from '../maze-solver/maze'; 
import Canvas from './Canvas';
import PopupDialog from './PopupDialog';
import CustomButton from './CustomButton';


const Main = () => {
  const [canvas, setCanvas] = useState({});
  //const [maze, setMaze] = useState({});

  const [storyPlaythroughToken, setStoryPlaythroughToken] = useState('');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [elapsedTickCount, setElapsedTickCount] = useState(0);
  const [mapStatus, setMapStatus] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isCurrentLevelFinished , setIsCurrentLevelFinished] = useState(false);
  const [fieldSize, setFieldSize] = useState('64px');

  const [heroTurn, setHeroTurn] = useState({});

  const [dialogProps, setDialogProps] = useState({open:false, handleClose: ()=>{}});
  
  const nextTurn = async (heroTurn) => {
    const { didTickHappen, message, tickLogs } = await apiApproveHeroTurn(heroTurn)
    console.log('didTickHappen', didTickHappen);

    if(didTickHappen) {
      const { map, heroes } = await apiMapState(storyPlaythroughToken);

      if(map.isGameOver) {
        setIsGameOver(map.isGameOver); 

        if(map.status === MAP_STATUS.WON) {
          //api: playthroughState
        } else if(map.status === MAP_STATUS.LOST) {

        }
        //Popup: Congratulation: Reset Level | Next Level
        //playthroughState
      } else {
        //MAP_STATUS.CRATED || MAP_STATUS.PLAYING
      }

      const heroesList = arrayToMap(heroes, fieldSize, currentLevel, FIELD_TYPE.HERO);
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

  const handleClose = () => {
    console.log('CLOSE')


    setDialogProps({...dialogProps, open: false});
  };

  const handleClickOpen = () => {

    const mydialogProps = {
      ...dialogProps, 
      open: true,
      dialogContentText: 'GAME OVER',
      buttonOkText: 'CONTINUE',
      buttonCancelText: 'END', 
      handleOk: handleClose,
      handleCancel: handleClose,
    }

    setDialogProps(mydialogProps);
  };

  const nextTurnHandle = () => {
    console.log('CLICK')
    heroTurn.storyPlaythroughToken = storyPlaythroughToken;

    handleClickOpen();
    //nextTurn(heroTurn);
  }

  const updateMaze = (mazeArg) => {
    //console.log('mazeArg', mazeArg)
    const maze = new Maze(mazeArg);
    const paths = maze.findPaths(true);
    //console.log('paths',paths);
    const direction = calcDirection(paths);
    const heroAction = getHeroAction(direction);
    //console.log(direction);
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

  useEffect(() => {

    const fetchData = async () => {
      const {storyPlaythroughToken, playthroughState: {currentLevel, isCurrentLevelFinished} } = await apiStoryBegin(PLAYER_TOKEN);
      const { mapId, compressedObstacles: {coordinateMap} } = await apiMapResource(storyPlaythroughToken);
      const { map, heroes } = await apiMapState(storyPlaythroughToken);

      const size = getImageSize(map.width);
      const obstaclesList = obstacleMapToArray(coordinateMap);
      const heroesList = arrayToMap(heroes, size, currentLevel, FIELD_TYPE.HERO);
      const treasures = arrayToMap(map.treasures, size, currentLevel, FIELD_TYPE.TREASURE);
      const obstacles = arrayToMap(obstaclesList, size, currentLevel, FIELD_TYPE.OBSTACLE);

      const enemies = {};
      const bullets = {};

      const canvas = {
        id: mapId,
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
      };

      setStoryPlaythroughToken(storyPlaythroughToken);
      setCurrentLevel(currentLevel);
      setIsCurrentLevelFinished(isCurrentLevelFinished);

      setElapsedTickCount(map.elapsedTickCount);
      setMapStatus(map.status);
      setIsGameOver(map.isGameOver);
      setFieldSize(size);

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
          <CustomButton onClick={nextTurnHandle} />
        </div>
      </main>
    <PopupDialog {...dialogProps} />
    </Fragment>
  )
}

export default Main;