import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const Header = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <header className="header">
      <div className="header-logo">
        <span className="header-span">
          <img 
            src={`./themes/${theme}/title.png`}
            className="header-img"
            alt=""
          />
        </span>
      </div>
    </header>
  )
}

export default Header;