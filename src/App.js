import { Fragment, useContext } from 'react';

import { NewGameContext } from './contexts/NewGameContext';
import MapScreen from './components/MapScreen';
import TitleScreen from './components/TitleScreen';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/App.scss';
import './styles/Styles.scss';


const App = () => {
  const { newGame } = useContext(NewGameContext);

  return (
    <Fragment>
      { newGame 
        ? <MapScreen />
        : <TitleScreen />
      }  
    </Fragment>
  );
}

export default App;
