import { pathsToModuleNameMapper } from 'ts-jest';
// import { compilerOptions } from './tsconfig.json';

export default {
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$', // Match .spec.ts files
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest', // Use ts-jest for .ts files
  },
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
  // moduleNameMapper: pathsToModuleNameMapper({}, {
  //   prefix: '<rootDir>/',
  // }),
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
};
