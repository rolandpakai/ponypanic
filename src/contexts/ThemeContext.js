import { createContext, useState, useLayoutEffect } from "react";
import { DEFAULT_THEME } from '../utils/constants';

export const ThemeContext = createContext({
  theme: 'dark', 
  selectTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(DEFAULT_THEME);

  const selectTheme = ({value, label}) => {
    setTheme(value);
  }

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