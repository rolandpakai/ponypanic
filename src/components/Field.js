import { useMemo, useContext } from "react";
import { ThemeContext } from '../contexts/ThemeContext';
import { FIELD_TYPE, TREASURE_COUNT } from '../utils/constants';
import { randomInteger } from '../utils/util';

const Field = ( props ) => {
  const { theme } = useContext(ThemeContext);
  const { id, collectedByHeroId, health, name, playerId, position, size, score, type, level } = {...props};

  let randomTreasure = useMemo(() => randomInteger(1, TREASURE_COUNT), [position]);

  const mapLevel = level > 11 ? 11 : level;

  const divStyle = {
    width: size,
    height: size,
    backgroundSize: size,
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url('./themes/${theme}/maps/map-${mapLevel}/floor.png')`,
  }

  let imgStyle = {
    width: size,
    height: size,
    backgroundRepeat: 'no-repeat',
    src: '',
  };

  switch (type) {
    case FIELD_TYPE.HERO: {imgStyle.src = `./themes/${theme}/heroes/stand-right.png`;break;}
    case FIELD_TYPE.TREASURE: {imgStyle.src = `./themes/${theme}/treasures/treasure-${randomTreasure}.png`;break;}
    case FIELD_TYPE.OBSTACLE: {imgStyle.src = `./themes/${theme}/maps/map-${mapLevel}/block.png`;break;}
    default: imgStyle.backgroundImage = '';
  }

  return (
      <div style={divStyle}>
        { type !== FIELD_TYPE.FLOOR &&
          <img 
            alt={type}
            className=''
            src={imgStyle.src}
            style={imgStyle}
          />
        }
      </div>
  )
}

export default Field;