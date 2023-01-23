import { React, useContext } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { ThemeContext } from '../contexts/ThemeContext';
import { THEMES_SELECT_OPTIONS, DEFAULT_THEME } from '../utils/constants';
import Select from 'react-select'

const Footer = () => {
  const { theme, selectTheme } = useContext(ThemeContext);

  const DEFAULT_THEME_OPTION = THEMES_SELECT_OPTIONS.find(theme => theme.value === DEFAULT_THEME);
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <ul>
            <li>
              <a href="https://www.linkedin.com/in/roland-p%C3%A1kai-6a2041249/" target="_blank" rel="noreferrer">
                <FaLinkedin size={"1.5em"}/>
              </a> 
            </li>
            <li>
              <a href="https://github.com/rolandpakai" target="_blank" rel="noreferrer">
                <FaGithub size={"1.5em"}/>
              </a> 
            </li>
          </ul>
        </div>
        <div className="footer-right">
          <Select
            name="theme-select"
            className="react-select-container"
            classNamePrefix="react-select"
            onChange={selectTheme}
            defaultValue={DEFAULT_THEME_OPTION}
            options={THEMES_SELECT_OPTIONS}
            isClearable={false}
            isSearchable={false}
            menuPlacement="top"  
          />
        </div>
      </div>
    </footer>
  )
}

export default Footer;