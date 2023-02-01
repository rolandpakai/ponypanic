import { createContext, useState, useLayoutEffect, useEffect } from "react";
import { DEFAULT_THEME, LOCAL_STORAGE_THEME_NAME } from '../utils/constants';
import { localStorageGetItem ,localStorageSetItem } from '../utils/util';

export const ThemeContext = createContext({
  theme: DEFAULT_THEME, 
  selectTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(DEFAULT_THEME);

  const selectTheme = (value) => {
    localStorageSetItem(LOCAL_STORAGE_THEME_NAME, value);
    setTheme(value);
  }

  useEffect(() => {
    const localStorageTheme = localStorageGetItem(LOCAL_STORAGE_THEME_NAME);
    if(localStorageTheme && localStorageTheme !== 'undefined') {
      setTheme(localStorageTheme);
    } else {
      localStorageSetItem(LOCAL_STORAGE_THEME_NAME, DEFAULT_THEME);
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