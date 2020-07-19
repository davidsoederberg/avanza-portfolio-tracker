module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'global-require': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
  },
};
