module.exports = {
  extends: 'marudor',
  env: {
    browser: true,
    node: true,
  },
  globals: {
    __DEV__: false,
  },
  rules: {
    'header/header': [2, 'line', ' @flow'],
  },
  plugins: [
    'header',
  ],
};
