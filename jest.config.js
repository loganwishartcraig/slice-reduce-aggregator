// // jest.config.js
// // const { defaults: tsjPreset } = require('ts-jest/presets');
// const { jsWithTs: tsjPreset } = require('ts-jest/presets');
// // const { jsWithBabel: tsjPreset } = require('ts-jest/presets');

// module.exports = {
//   // [...]
//   transform: {
//     ...tsjPreset.transform,
//     // [...]
//   }
// }

module.exports = {
  "roots": [
    "<rootDir>/lib"
  ],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)?$": "ts-jest"
  },
}
