'use strict';

const vitePlugin = require('..');
const assert = require('assert').strict;

assert.strictEqual(vitePlugin(), 'Hello from vitePlugin');
console.info('vitePlugin tests passed');
