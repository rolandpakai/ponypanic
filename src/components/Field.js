import { useMemo, useContext, useState, Fragment } from "react";
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { ThemeContext } from '../contexts/ThemeContext';
import { randomInteger, validateHeroAction } from '../utils/util';
import { FIELD_TYPE, TREASURE_COUNT, MAP_COUNT } from '../utils/constants';

const Field = ( props ) => {
  const [anchorEl, setAnchorEl] = useState();
  const { theme } = useContext(ThemeContext);
  const { idd, position, size, action, type, level, data } = {...props};

  const open = Boolean(anchorEl);
  let hasPopOver = false;
  let randomTreasure = useMemo(() => randomInteger(1, TREASURE_COUNT), []);
  const mapLevel = level > MAP_COUNT ? MAP_COUNT : level;

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  let imgStyle = {
    width: size,
    height: size,
    backgroundRepeat: 'no-repeat',
    margin: 'auto',
    src: '',
  };

  let popoverProps = {};
  let popoverContent;

  switch (type) {
    case FIELD_TYPE.HERO: {
      const { playerId, health, score} = {...data};
      const heroAction = validateHeroAction(action).toLowerCase();
      imgStyle.src = `./themes/${theme}/heroes/${heroAction}.png`;
      hasPopOver = true;
      popoverContent = (
        <TableBody>
          <TableRow key={`${idd}-playerId`}><TableCell align="left">HeroId</TableCell><TableCell align="right">{playerId}</TableCell></TableRow>
          <TableRow key={`${idd}-health`}><TableCell align="left">Health</TableCell><TableCell align="right">{health.toLocaleString("en", {style: "percent"})}</TableCell></TableRow>
          <TableRow key={`${idd}-score`}><TableCell align="left">Score</TableCell><TableCell align="right">{score}</TableCell></TableRow>
        </TableBody>
      );
      break;
    } 
    case FIELD_TYPE.ENEMY:
    case FIELD_TYPE.ENEMY_BULLET: {
      const { id, moveProbability, shootProbability, onTouchDamage, bulletDamage, health} = {...data};
      imgStyle.src = `./themes/${theme}/enemies/${type.toLowerCase()}-${mapLevel}.png`;
      hasPopOver = true;
      popoverContent = (
        <TableBody>
          <TableRow key={`${idd}-id`}><TableCell align="left">Id</TableCell><TableCell align="right">{id}</TableCell></TableRow>
          <TableRow key={`${idd}-health`}><TableCell align="left">Health</TableCell><TableCell align="right">{health.toLocaleString("en", {style: "percent"})}</TableCell></TableRow>
          <TableRow key={`${idd}-moveProbability`}><TableCell align="left">Move Probability</TableCell><TableCell align="right">{moveProbability.toLocaleString("en", {style: "percent"})}</TableCell></TableRow>
          <TableRow key={`${idd}-shootProbability`}><TableCell align="left">Shoot Probability</TableCell><TableCell align="right">{shootProbability.toLocaleString("en", {style: "percent"})}</TableCell></TableRow>
          <TableRow key={`${idd}-bulletDamage`}><TableCell align="left">Bullet Damage</TableCell><TableCell align="right">{bulletDamage.toLocaleString("en", {style: "percent"})}</TableCell></TableRow>
          <TableRow key={`${idd}-onTouchDamage`}><TableCell align="left">Touch Damage</TableCell><TableCell align="right">{onTouchDamage.toLocaleString("en", {style: "percent"})}</TableCell></TableRow>
        </TableBody>
      );
      break;
    }
    case FIELD_TYPE.BULLET: {
      const { id, damage, direction, shotByEnemyId} = {...data};
      imgStyle.src = `./themes/${theme}/bullets/bullet.png`;
      imgStyle.width = 'auto';
      imgStyle.height = 'auto';
      break;
    }
    case FIELD_TYPE.TREASURE: {
      const { id, collectedByHeroId, name} = {...data};
      imgStyle.src = `./themes/${theme}/treasures/treasure-${randomTreasure}.png`;
      hasPopOver = true;
      popoverContent = (
        <TableBody>
          <TableRow key={`${idd}-name`}><TableCell align="center">{name}</TableCell></TableRow>
        </TableBody>
      );
      break;
    }
    case FIELD_TYPE.OBSTACLE: {
      imgStyle.src = `./themes/${theme}/maps/map-${mapLevel}/block.png`;
      break;
    }
    default: imgStyle.backgroundImage = '';
  }

  if(hasPopOver) {
    popoverProps = {
      "aria-owns": open ? 'mouse-over-popover' : undefined,
      "aria-haspopup": "true",
      onMouseEnter: handlePopoverOpen,
      onMouseLeave: handlePopoverClose,
    }
  }

  return (
    <Fragment>
      <Box 
        {...popoverProps}

        sx={{
          width: size,
          height: size,
          display: 'flex',
          backgroundSize: size,
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url('./themes/${theme}/maps/map-${mapLevel}/floor.png')`,
        }}
      >
        { type !== FIELD_TYPE.FLOOR &&
          <img 
            alt={type}
            className=''
            src={imgStyle.src}
            style={imgStyle}
          />
        }
      </Box>
      {
        hasPopOver &&
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none',
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <TableContainer>
            <Table 
              size="small" 
              aria-label="simple table"
              sx={{
                [`& .${tableCellClasses.root}`]: {
                  borderBottom: "none"
                }
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}>{type}</TableCell>
                </TableRow>
              </TableHead>
                {popoverContent}
            </Table>
          </TableContainer>
        </Popover>
      }
    </Fragment>
  )
}

export default Field;