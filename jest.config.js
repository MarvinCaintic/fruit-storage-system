module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        "**/tests/unit/**/*.test.ts",
        "**/tests/integration/**/*.integration.test.ts"
    ],
};
