import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import { Fragment } from 'react';

import './App.scss';
import './Styles.scss';

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
