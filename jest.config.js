/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  moduleFileExtensions: ['js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
}
