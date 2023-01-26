import { createContext, useState, useLayoutEffect, useEffect } from "react";
import { DEFAULT_THEME } from '../utils/constants';

export const ThemeContext = createContext({
  theme: 'dark', 
  selectTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(DEFAULT_THEME);

  const selectTheme = ({value, label}) => {
    localStorage.setItem('pony-panic-theme', value);
    setTheme(value);
  }

  useEffect(() => {
    const localStorageTheme = localStorage.getItem('pony-panic-theme');
    if(localStorageTheme) {
      setTheme(localStorageTheme);
    } else {
      localStorage.setItem('pony-panic-theme', DEFAULT_THEME);
      setTheme(DEFAULT_THEME);
    }
  }, [])

  useLayoutEffect(() => {
    const element = document.documentElement;
    element.classList.remove(...element.classList);
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  const value = {
    theme, 
    selectTheme,
  }

  return (
    <ThemeContext.Provider value={ value }>
      {children}
    </ThemeContext.Provider>
  );
};