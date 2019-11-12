module.exports = {
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.test.json'
        }
    }
}
