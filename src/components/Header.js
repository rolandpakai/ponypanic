import { useContext } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { ThemeContext } from '../contexts/ThemeContext';

const Header = () => {
  const { theme } = useContext(ThemeContext);

  return (
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
          <img 
            src={`./themes/${theme}/title.png`}
            className="header-img"
            alt="title"
            style={{
              display: 'block',
              height: '100%',
              objectFit: 'contain',
              height: '110px',
            }}
          />
        </Stack>
      </Container>
    </Box>
  )
}

export default Header;