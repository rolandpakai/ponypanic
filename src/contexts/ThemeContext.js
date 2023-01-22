import { createContext, useContext, useState, useLayoutEffect } from "react";

export const ThemeContext = createContext({
  theme: 'dark', 
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  }

  useLayoutEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark-mode");
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
      document.documentElement.classList.add("dark-mode");
    }
  }, [theme]);

  const value = {
    theme, 
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={ value }>
      {children}
    </ThemeContext.Provider>
  );
};

/*const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};*/

//export { ThemeProvider, useTheme };