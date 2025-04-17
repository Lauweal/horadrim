'use strict';

const importPlugin = require('..');
const assert = require('assert').strict;

assert.strictEqual(importPlugin(), 'Hello from importPlugin');
console.info('importPlugin tests passed');
