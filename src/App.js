import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import { Fragment } from 'react';

import './styles/App.scss';
import './styles/Styles.scss';

const App = () => {
  return (
    <Fragment>
      <Header />
      <Main />
      <Footer />
    </Fragment>
  );
}

export default App;
