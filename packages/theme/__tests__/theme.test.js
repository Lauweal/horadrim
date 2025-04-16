'use strict';

const theme = require('..');
const assert = require('assert').strict;

assert.strictEqual(theme(), 'Hello from theme');
console.info('theme tests passed');
