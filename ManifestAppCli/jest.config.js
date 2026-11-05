module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^@components$': '<rootDir>/src/components',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-redux|@reduxjs|immer|reselect|redux|redux-thunk|react-native-linear-gradient|react-native-vector-icons)/)',
  ],
};
