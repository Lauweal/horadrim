module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
    modulePathIgnorePatterns:[
        '<rootDir>/src/__tests__',
        '<rootDir>/node_modules',
        '<rootDir>/build',
    ],
    moduleDirectories: ['node_modules', 'src'],
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node'
    ],
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        resources: 'usable',
        runScripts: 'dangerously',
    },
    coveragePathIgnorePatterns: ['/node_modules/', '/build/','__tests__']
};