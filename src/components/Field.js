import { useMemo, useContext } from "react";
import Box from '@mui/material/Box';

import { ThemeContext } from '../contexts/ThemeContext';
import { randomInteger, validateHeroAction } from '../utils/util';
import { FIELD_TYPE, TREASURE_COUNT, MAP_COUNT, ENEMY_COUNT } from '../utils/constants';

const Field = ( props ) => {
  const { theme } = useContext(ThemeContext);
  const { id, collectedByHeroId, health, name, playerId, position, size, score, action, type, level } = {...props};

  let randomTreasure = useMemo(() => randomInteger(1, TREASURE_COUNT), []);
  let randomEnemy = useMemo(() => randomInteger(1, ENEMY_COUNT), []);

  const mapLevel = level > MAP_COUNT ? MAP_COUNT : level;

  let imgStyle = {
    width: size,
    height: size,
    backgroundRepeat: 'no-repeat',
    margin: 'auto',
    src: '',
  };

  switch (type) {
    case FIELD_TYPE.HERO: {
      const heroAction = validateHeroAction(action);
      imgStyle.src = `./themes/${theme}/heroes/${heroAction}.png`;
      break;
    } 
    case FIELD_TYPE.ENEMY: {
      imgStyle.src = `./themes/${theme}/enemies/enemy-${id}.png`;
      break;
    }
    case FIELD_TYPE.ENEMY_BULLET: {
      imgStyle.src = `./themes/${theme}/enemies/enemy-bullet-${id}.png`;
      break;
    }
    case FIELD_TYPE.BULLET: {
      imgStyle.src = `./themes/${theme}/bullets/bullet.png`;
      imgStyle.width = 'auto';
      imgStyle.height = 'auto';
      break;
    }
    case FIELD_TYPE.TREASURE: {
      imgStyle.src = `./themes/${theme}/treasures/treasure-${randomTreasure}.png`;
      break;
    }
    case FIELD_TYPE.OBSTACLE: {
      imgStyle.src = `./themes/${theme}/maps/map-${mapLevel}/block.png`;
      break;
    }
    default: imgStyle.backgroundImage = '';
  }

  return (
      <Box sx={{
        width: size,
        height: size,
        display: 'flex',
        backgroundSize: size,
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url('./themes/${theme}/maps/map-${mapLevel}/floor.png')`,
      }}>
        { type !== FIELD_TYPE.FLOOR &&
          <img 
            alt={type}
            className=''
            src={imgStyle.src}
            style={imgStyle}
          />
        }
      </Box>
  )
}

export default Field;