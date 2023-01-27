import { Fragment, useEffect, useState, useContext } from 'react';

import { NewGameContext } from '../contexts/NewGameContext';
import { apiStoryBegin, apiMapResource, apiMapState, apiApproveHeroTurn, apiPlaythroughState, apiResetLevel, apiNextLevel } from '../api/api';
import { GAME_MODE, PLAYER_TOKEN, FIELD_TYPE, MAP_STATUS } from '../utils/constants';
import { arrayToMap, obstacleMapToArray, getImageSize } from '../utils/util';
import Canvas from './Canvas';
import PopupDialog from './PopupDialog';
import CustomButton from './CustomButton';

const MapContainer = () => {
  const [gameMode, setGameMode] = useState(GAME_MODE.STORY);
  const {newGame, setNewGame} = useContext(NewGameContext);
  const [canvas, setCanvas] = useState({});
  const [storyPlaythroughToken, setStoryPlaythroughToken] = useState('');
  const [heroTurn, setHeroTurn] = useState({});
  const [dialogProps, setDialogProps] = useState({open:false});

  const updateHeroTurn = (heroTurn) => {
    setHeroTurn(heroTurn)
  }

  const getCanvasData = (mapResource, mapState, currentLevel) => {
    const { mapId, compressedObstacles: {coordinateMap} } = mapResource;
    const { map, heroes } = mapState;

    const size = getImageSize(map.width);
    const obstaclesList = obstacleMapToArray(coordinateMap);
    const heroesList = arrayToMap(heroes, FIELD_TYPE.HERO);
    const treasures = arrayToMap(map.treasures, FIELD_TYPE.TREASURE);
    const obstacles = arrayToMap(obstaclesList, FIELD_TYPE.OBSTACLE);
    const enemies = arrayToMap(map.enemies, FIELD_TYPE.ENEMY);
    const bullets = arrayToMap(map.bullets, FIELD_TYPE.BULLET);

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
      collected: {},
      currentLevel: currentLevel,
      gameMode: gameMode,
      updateHeroTurn: updateHeroTurn,
    };

  }

  const resetLevel = async () => {
    const { playthroughState: {currentLevel, isCurrentLevelFinished, currentMapStatus} } = await apiResetLevel(storyPlaythroughToken);
    const mapResource= await apiMapResource(storyPlaythroughToken);
    const mapState = await apiMapState(storyPlaythroughToken);
    const newCanvas = getCanvasData(mapResource, mapState, currentLevel)

    setDialogProps({...dialogProps, open: false});
    setCanvas(newCanvas);
  }

  const nextLevel = async () => {
    const { playthroughState: {currentLevel, isCurrentLevelFinished, currentMapStatus} } = await apiNextLevel(storyPlaythroughToken);
    const mapResource = await apiMapResource(storyPlaythroughToken);
    const mapState = await apiMapState(storyPlaythroughToken);
    const newCanvas = getCanvasData(mapResource, mapState, currentLevel)

    setDialogProps({...dialogProps, open: false});
    setCanvas(newCanvas);
  }

  const endHandler = () => {
    console.log('endHandler');
    setNewGame(false);
  };

  const continueHandler = () => {
    console.log('continueHandler')
    resetLevel(storyPlaythroughToken);
  };

  const nextHandler = () => {
    console.log('nextHandler')
    nextLevel();
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
    const { didTickHappen, message, tickLogs } = await apiApproveHeroTurn(storyPlaythroughToken, heroTurn)

    if(didTickHappen) {
      const { map, heroes } = await apiMapState(storyPlaythroughToken);

      if(map.isGameOver) {
        const {currentLevel, currentMapStatus, isCurrentLevelFinished} = await apiPlaythroughState(storyPlaythroughToken);
        
        if(map.status === MAP_STATUS.WON) {
          setDialogProps(dialogPropsStatus[MAP_STATUS.WON]);
        } else if(map.status === MAP_STATUS.LOST) {
          setDialogProps(dialogPropsStatus[MAP_STATUS.LOST]);
        }
      } else {
        //MAP_STATUS.CRATED || MAP_STATUS.PLAYING
        const updates = {
          heroes: arrayToMap(heroes, FIELD_TYPE.HERO, heroTurn),
          enemies: arrayToMap(map.enemies, FIELD_TYPE.ENEMY),
          bullets: arrayToMap(map.bullets, FIELD_TYPE.BULLET),
        }
        const treasures = arrayToMap(map.treasures, FIELD_TYPE.TREASURE);
        const collectedList = Object.values(treasures).filter((treasure)=>treasure.collectedByHeroId!=null);
        
        if(collectedList.length > 0) {
          const collected = arrayToMap(collectedList, FIELD_TYPE.COLLECTED_TREASURE);
          updates.collected = collected;
        }

        setCanvas({
          ...canvas,
          ...updates
        });
      }
    }
  }

  const nextTurnHandle = () => {
    heroTurn.storyPlaythroughToken = storyPlaythroughToken;

    nextTurn(heroTurn);
  }

  useEffect(() => {

    const fetchData = async () => {
      const {storyPlaythroughToken, playthroughState: {currentLevel, isCurrentLevelFinished, currentMapStatus} } = await apiStoryBegin(PLAYER_TOKEN);
      const mapResource = await apiMapResource(storyPlaythroughToken);
      const mapState = await apiMapState(storyPlaythroughToken);
      const canvas = getCanvasData(mapResource, mapState, currentLevel)

      setStoryPlaythroughToken(storyPlaythroughToken);
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