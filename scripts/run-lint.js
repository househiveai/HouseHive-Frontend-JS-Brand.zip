#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');
const Module = require('module');

const env = { ...process.env };
const stubPath = path.resolve(__dirname, '..', 'stubs');
if (env.NODE_PATH) {
  env.NODE_PATH = `${stubPath}${path.delimiter}${env.NODE_PATH}`;
} else {
  env.NODE_PATH = stubPath;
}
Module._initPaths();

const bin = process.platform === 'win32' ? 'next.cmd' : 'next';
const result = spawnSync(bin, ['lint'], {
  stdio: 'inherit',
  env,
});

if (result.error) {
  console.error(result.error);
}
process.exit(result.status ?? 1);
