const { jestPreset: tsJest } = require('ts-jest');

module.exports = {
  ...tsJest,
  transform: {
    ...tsJest.transform,
    "^.+\\.js$": "<rootDir>/node_modules/react-native/jest/preprocessor.js",
  },
  globals: {
    "ts-jest": {
      babelConfig: true,
    }
  },
  "transformIgnorePatterns": [
    "node_modules/(?!react-native|native-base/node_modules/react-native-keyboard-aware-scroll-view|react-native-keyboard-aware-scroll-view|native-base-shoutem-theme|@shoutem/animation|@shoutem/ui|tcomb-form-native)"
  ],
  "preset": "react-native",
  "testURL": "http://localhost/",
  "snapshotSerializers": [
    "enzyme-to-json/serializer"
  ],
  "testPathIgnorePatterns": [
    "<rootDir>/__tests__/setup/",
    "<rootDir>/node_modules"
  ],
  "setupTestFrameworkScriptFile": "./__tests__/setup/setupEnzyme.tsx",
  "testEnvironment": "jsdom",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
};
