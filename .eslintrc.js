module.exports = {
  extends: ["airbnb", "plugin:prettier/recommended"],
  env: {
    jest: true,
    browser: true,
  },
  parserOptions: {
    babelOptions: {
      presets: ["@babel/preset-react"],
    },
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "no-param-reassign": [
      2,
      {
        props: false,
      },
    ],
    "arrow-parens": ["warn", "always"],
  },
};
