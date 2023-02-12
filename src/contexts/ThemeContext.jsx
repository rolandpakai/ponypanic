import React, {
  createContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import {
  existsItemInLocalStorage,
  getItemFromLocalStorage,
  setItemInLocalStorage,
} from "../utils/util";
import { DEFAULT_THEME, LOCAL_STORAGE_THEME_NAME } from "../utils/constants";

export const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  selectTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(DEFAULT_THEME);

  const selectTheme = (value) => {
    setItemInLocalStorage(LOCAL_STORAGE_THEME_NAME, value);
    setTheme(value);
  };

  useEffect(() => {
    let newTheme = theme;

    if (existsItemInLocalStorage(LOCAL_STORAGE_THEME_NAME)) {
      const storedTheme = getItemFromLocalStorage(LOCAL_STORAGE_THEME_NAME);
      newTheme = storedTheme;
    } else {
      setItemInLocalStorage(LOCAL_STORAGE_THEME_NAME, DEFAULT_THEME);
      newTheme = DEFAULT_THEME;
    }

    setTheme(newTheme);
  }, []);

  useLayoutEffect(() => {
    const element = document.documentElement;
    element.classList.remove(...element.classList);
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  const value = useMemo(() => ({ theme, selectTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
