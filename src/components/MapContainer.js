import { Fragment, useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from "@mui/material/Stack";

import { NewGameContext } from '../contexts/NewGameContext';
import { apiStoryBegin, apiMapResource, apiMapState, apiApproveHeroTurn, apiPlaythroughState, apiResetLevel, apiNextLevel } from '../api/api';
import { xyTOij, arrayToMap, mapToArray, getImageSize, getHeroKickRange, getHeroNextTurn, getHeroMazePath } from '../utils/util';
import { GAME_MODE, PLAYER_TOKEN, FIELD_TYPE, MAP_STATUS } from '../utils/constants';
import { Algorithms, Heuristic } from '../path-finder/constants';
import Canvas from './Canvas';
import PopupDialog from './PopupDialog';
import Button from './Button';
import Field from "./Field";

const MapContainer = () => {
  const [gameMode, setGameMode] = useState(GAME_MODE.STORY);
  const {newGame, setNewGame} = useContext(NewGameContext);

  const [canvas, setCanvas] = useState({});
  const [storyPlaythroughToken, setStoryPlaythroughToken] = useState('');
  const [heroTurn, setHeroTurn] = useState({});

  const [canvasFields, setCanvasFields] = useState([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [mapId, setMapId] = useState(0);

  const [mazePath, setMazePath] = useState([]);
  const [mazeStep, setMazeStep] = useState(0);
  const [dialogProps, setDialogProps] = useState({open:false});

  const addField = (x, y, fieldType, fieldSize, currentLevel, fields) => {
    const id = `${x}-${y}`;

    let field = {
      id: id,
      position: {
        x: x,
        y: y,
      },
      size: fieldSize,
      level: currentLevel,
      type: fieldType
    };

    fields.push(<Field key={id} {...field} />);
  }

  const getCanvasFields = (props) => {
    const { 
      width, 
      height, 
      fieldSize, 
      heroes, 
      enemies, 
      bullets,
      treasures, 
      collected, 
      obstacles, 
      currentLevel, 
      elapsedTickCount,
      gameMode 
    } = {...props};

    const fields = [];
    const startNodes = [];
    const endNodes = [];
    const maze = Array.from(Array(height), () => []);
    const hasEnemy = !(Object.keys(enemies).length === 0);

    for (let j = -1; j <= height; j++) {
      addField(j, height, FIELD_TYPE.OBSTACLE, fieldSize, currentLevel, fields);
    }

    for (let i = width-1; i >= 0; i--) {
      for (let j = 0; j < height; j++) {
        const id = `${j}-${i}`;
        const xy = xyTOij(i, j ,height);
        maze[xy.i][xy.j] = 0;

        if(j === 0) {
          addField(-1, i, FIELD_TYPE.OBSTACLE, fieldSize, currentLevel, fields);
        }

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
          endNodes.push({ x: xy.j, y: xy.i, id: field.id, idd: id })
        } 

        if(heroes[id]) {
          if(hasEnemy) {
            const { kickRange, enemyInKickRange, bulletInRange } = getHeroKickRange(heroes[id], enemies, bullets)
            heroes[id].kickRange = kickRange;
            heroes[id].enemyInKickRange = enemyInKickRange;
            heroes[id].bulletInRange = bulletInRange;
          }

          field = {...field, ...heroes[id]};
          startNodes.push({ x: xy.j, y: xy.i, id: field.id, idd: id })
        } 

        if(enemies[id]) {
          if(enemies[id].health > 0) {
            field = {...field, ...enemies[id]};
          }
        } 

        if(bullets[id]) {
          field = {...field, ...bullets[id]};
        } 

        if(enemies[id] && bullets[id]) {
          field = {...field, ...enemies[id], type: FIELD_TYPE.ENEMY_BULLET};
        } 
        
        if(obstacles[id]) {
          field = {...field, ...obstacles[id]};
          maze[xy.i][xy.j] = 2;
        } 

        fields.push(<Field key={id} {...field} />);

        if(j === width-1) {
          addField(width, i, FIELD_TYPE.OBSTACLE, fieldSize, currentLevel, fields);
        }
    } }

    for (let j = -1; j <= height; j++) {
      addField(j, -1, FIELD_TYPE.OBSTACLE, fieldSize, currentLevel, fields);
    }

    let step = mazeStep;

    if(elapsedTickCount === 0) {
      step = 0;
    }
    
    if(gameMode === GAME_MODE.STORY) {
      let nextHeroTurn = {};
      const startNode = startNodes[0];
      const hero = heroes[startNode.idd];

      if(collected[startNode.idd] && collected[startNode.idd].collectedByHeroId === hero.id) {
        step = 0;
      }

      if(step === 0) {
        const mazeArg = {
          board: maze,
          startNodes: startNode,
          endNodes: endNodes,
          algorithm: Algorithms.BFS,
          heuristic: Heuristic.Euclidean,
          rowCount: width,
          colCount: height,
          allowDiagonalMoves: false,
        };
        
        const mazePath = getHeroMazePath(mazeArg);
        nextHeroTurn = getHeroNextTurn(hero, mazePath, hasEnemy, step);

        setMazePath(mazePath);
      } else {
        nextHeroTurn = getHeroNextTurn(hero, mazePath, hasEnemy, step);
      }

      setHeroTurn(nextHeroTurn)
      setMazeStep(nextHeroTurn.step);
    }

    return fields;
  }

  const getCanvasData = (mapResource, mapState, currentLevel) => {
    const { mapId, compressedObstacles: {coordinateMap} } = mapResource;
    const { map, heroes } = mapState;

    const size = getImageSize(map.width);
    const obstaclesList = mapToArray(coordinateMap);
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
      elapsedTickCount: map.elapsedTickCount,
      gameMode: gameMode,
    };
  }

  const setState = async (storyPlaythroughToken, currentLevel) => {

    const mapResource = await apiMapResource(storyPlaythroughToken);
    const mapState = await apiMapState(storyPlaythroughToken);
    const canvas = getCanvasData(mapResource, mapState, currentLevel)
    const canvasFields = getCanvasFields(canvas);

    setWidth(canvas.width);
    setHeight(canvas.height);
    setMapId(canvas.mapId);
    setCanvas(canvas);
    setCanvasFields(canvasFields);

    setDialogProps({...dialogProps, open: false});
  }

  const resetLevel = async () => {
    const { playthroughState: {currentLevel, isCurrentLevelFinished, currentMapStatus} } = await apiResetLevel(storyPlaythroughToken);
    setState(storyPlaythroughToken, currentLevel);
  }

  const nextLevel = async () => {
    const { playthroughState: {currentLevel, isCurrentLevelFinished, currentMapStatus} } = await apiNextLevel(storyPlaythroughToken);
    setState(storyPlaythroughToken, currentLevel);
  }

  const endHandler = () => {
    setNewGame(false);
  };

  const continueHandler = () => {
    resetLevel(storyPlaythroughToken);
  };

  const nextHandler = () => {
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

      const updates = {
        heroes: arrayToMap(heroes, FIELD_TYPE.HERO, heroTurn),
        enemies: arrayToMap(map.enemies, FIELD_TYPE.ENEMY),
        bullets: arrayToMap(map.bullets, FIELD_TYPE.BULLET),
        elapsedTickCount: map.elapsedTickCount,
      }
      const treasures = arrayToMap(map.treasures, FIELD_TYPE.TREASURE);
      const collectedList = Object.values(treasures).filter((treasure)=>treasure.collectedByHeroId!=null);
      
      if(collectedList.length > 0) {
        const collected = arrayToMap(collectedList, FIELD_TYPE.COLLECTED_TREASURE);
        updates.collected = collected;
      }

      const newCanvas = {
        ...canvas,
        ...updates
      }

      setCanvas(newCanvas);

      const canvasFields = getCanvasFields(newCanvas);
      setCanvasFields(canvasFields);

      if(map.isGameOver) {
        const {currentLevel, currentMapStatus, isCurrentLevelFinished} = await apiPlaythroughState(storyPlaythroughToken);
        
        if(map.status === MAP_STATUS.WON) {
          setDialogProps(dialogPropsStatus[MAP_STATUS.WON]);
        } else if(map.status === MAP_STATUS.LOST) {
          setDialogProps(dialogPropsStatus[MAP_STATUS.LOST]);
        }
      }
    }
  }

  const nextTurnHandle = () => {
    nextTurn(heroTurn);
  }

  useEffect(() => {
    const fetchData = async () => {
      const {storyPlaythroughToken, playthroughState: {currentLevel, isCurrentLevelFinished, currentMapStatus} } = await apiStoryBegin(PLAYER_TOKEN);
      setState(storyPlaythroughToken, currentLevel);
      setStoryPlaythroughToken(storyPlaythroughToken);
    }

    fetchData();
  }, []);

  return (
    <Fragment>   
      <main className="cmain">
        <Box>
          <Container 
            maxWidth="md" 
          >
          <Stack 
              maxWidth="xs"
              direction="row" 
              justifyContent="center" 
              sx={{
                padding: '2rem',
              }}
            >
            <Box 
              sx={{
                border: '5px solid #3a3b3b',
              }}
            >
                <Canvas 
                  id={mapId}
                  width={width}
                  height={height}
                  fields={canvasFields}
                />
            </Box>
            </Stack>
          </Container>

          <Container 
            maxWidth="xs" 
           >
            <Stack 
              maxWidth="xs"
              direction="row" 
              justifyContent="center" 
            >
              <Button onClick={nextTurnHandle} >
                {"HERO TURN"}
              </Button>
            </Stack>
          </Container>

        </Box>
      </main>
      <PopupDialog {...dialogProps} />
    </Fragment>
  )
}

export default MapContainer;