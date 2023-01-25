import { Fragment } from 'react';
import Header from './Header'; 
import MapContainer from './MapContainer'; 
import Footer from './Footer'; 

const MapScreen = () => {

  return (
    <Fragment> 
      <Header />  
      <MapContainer />
      <Footer />
    </Fragment>
  )
}

export default MapScreen;