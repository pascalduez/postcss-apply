const isCI = require('is-ci');

const config = {
  testEnvironment: 'node',
  cacheDirectory: '.jest-cache',
  collectCoverageFrom: ['src/*.js'],
};

if (isCI) {
  Object.assign(config, {
    collectCoverage: true,
  });
}

module.exports = config;
