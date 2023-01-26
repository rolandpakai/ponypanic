import { Fragment, useContext } from 'react'; 
import { ThemeContext } from '../contexts/ThemeContext';
import { NewGameContext } from '../contexts/NewGameContext';

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
    <Container maxWidth="lg">
      <Box sx={{  
        height: '550px', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
        backgroundImage: `url('./themes/${theme}/title-screen.png')` }} />
      <Box>
        <CustomButton onClick={onClickHandler} title={"NEW GAME"} />
      </Box>
    </Container>
  </Fragment>
  )
}

export default TitleContainer;