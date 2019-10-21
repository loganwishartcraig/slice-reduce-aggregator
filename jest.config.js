module.exports = {
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.test.json'
        }
    }
}
