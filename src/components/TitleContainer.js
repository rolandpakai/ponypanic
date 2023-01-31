import { Fragment, useContext } from 'react'; 
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from "@mui/material/Stack";

import { ThemeContext } from '../contexts/ThemeContext';
import { NewGameContext } from '../contexts/NewGameContext';
import Button from './Button';

const TitleContainer = () => {
  const { theme } = useContext(ThemeContext);
  const { setNewGame } = useContext(NewGameContext);

  const onClickHandler = () => {
    setNewGame(true);
  }
  
  return (
    <Fragment>
      <Box>
        <Container 
          maxWidth="md" 
        >
          <Box 
            justifyContent="center" 
            sx={{  
              height: '550px', 
              padding: '2rem',
              backgroundPosition: 'center', 
              backgroundRepeat: 'no-repeat', 
              backgroundImage: `url('./themes/${theme}/title-screen.png')` }}
          />
        </Container>
        <Container 
          maxWidth="xs" 
        >
          <Stack 
            maxWidth="xs"
            direction="row" 
            justifyContent="center" 
          >
            <Button onClick={onClickHandler}>
              {"NEW GAME"} 
            </Button>
          </Stack>
        </Container>
      </Box>
  </Fragment>
  )
}

export default TitleContainer;