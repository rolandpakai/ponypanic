import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';


const Footer = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <footer className="footer">
      <div className="footer-content">
        FOOTER {theme}
        <button onClick={toggleTheme}>TOGGLE</button>
      </div>
    </footer>
  )
}

export default Footer;