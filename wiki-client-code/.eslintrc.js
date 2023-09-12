module.exports = {
  root: true,
  plugins: [
    'es5',
  ],
  globals: {
    "$": true,
    "mw": true,
    "OO": true,
    "rs": true
  },
  env: {
    "browser": true
  },
  extends: [
    'eslint:recommended',
    "plugin:es5/no-es2015",
    "plugin:es5/no-es2016"
  ],
  rules: {
    "es5/no-es6-methods": false
  }
};
