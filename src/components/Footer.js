import { React, useContext } from 'react';
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
          FOOTER {theme}
        </div>
        <div className="footer-right">
          <Select
            name="theme-select"
            className="basic-single"
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