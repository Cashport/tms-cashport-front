module.exports = {
  singleQuote: false,
  arrowParens: "always",
  trailingComma: "none",
  jsxBracketSameLine: true,
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  overrides: [
    {
      files: "*.scss",
      options: {
        tabWidth: 4
      }
    }
  ]
};
