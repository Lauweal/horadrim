/* eslint-disable no-undef */
const base = require('../../jest.config.base.js');

module.exports = {
    ...base,
    moduleNameMapper: {
        '^@components/(.*)$': '<rootDir>/src/$1',
    },
    displayName: '@horadrim/components'
};