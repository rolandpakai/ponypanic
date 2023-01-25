import { Fragment, useContext } from 'react'; 
import { ThemeContext } from '../contexts/ThemeContext';
import { NewGameContext } from '../contexts/NewGameContext';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CustomButton from './CustomButton';

const TitleContainer = () => {
  const { theme } = useContext(ThemeContext);
  const { setNewGame } = useContext(NewGameContext);

  const onClickHandler = () => {
    setNewGame(true);
  }

  return (
    <Fragment>
    <CssBaseline />
    <Container  maxWidth="sm">
      <Box sx={{ width: '550px', height: '550px', backgroundImage: `url('./themes/${theme}/title-screen.png')` }} />
      <Box sx={{}} >
        <CustomButton onClick={onClickHandler} title={"NEW GAME"} />
      </Box>
    </Container>
  </Fragment>
  )
}

export default TitleContainer;