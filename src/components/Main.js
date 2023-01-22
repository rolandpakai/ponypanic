import { useEffect, useState } from 'react';
import { mockMapState } from './Map.test';

const HERO_STATE = {
  STAND: 'stand', 
  SHILD: 'shild',
  ATTACK: 'attack',
}

const HERO_MOVE = {
  LEFT: 'left', 
  SHILD: 'right',
  UP: 'up',
  DOWN: 'down',
}

const Main = () => {
  const [canvas, setCanvas] = useState([]);

  const xyTOij = (x, y, height) => {
      return { i: height - y - 1, j: x }
  }

  const setHeroPosition = (position) => {

    const id = `id-${position.i}-${position.j}`;
    const element = document.getElementById(id);
    
    if(element)
      document.getElementById(id).classList.add('hero');
  }

  const getCanvaPositions = (array, mapHeight) => {
      return array.map((el) => {
        const ij = xyTOij(el.position.x, el.position.y, mapHeight);
        
        return `id-${ij.i}-${ij.j}`
      })
  }


  useEffect(() => {

    const { map, heroes } = mockMapState;
  
    const herosCanvaPosition = getCanvaPositions(heroes, map.height);
    const treasuresCanvaPosition = getCanvaPositions(map.treasures, map.height);

    const canvas = [];

    for (let i = 0; i < map.width; i++) {
      for (let j = 0; j < map.height; j++) {
        
        const key = `key-${i}-${j}`;
        const id = `id-${i}-${j}`;

        let addClass = '';

        if (herosCanvaPosition.includes(id)) {
          addClass = 'hero';
        } else if (treasuresCanvaPosition.includes(id)) {
          addClass = 'treasure';
        }
  
        canvas.push(<div key={key} id={id} className={`floor ${addClass}`}>
          {i}{j}
        </div>);
    } }


    setCanvas(canvas);

  }, []);

  return (
    <main className="main">
      <div className="main-container">
        <div className="sub-container">
          <div className="panel-left">
            <div className="canvas">
              { canvas }
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Main;