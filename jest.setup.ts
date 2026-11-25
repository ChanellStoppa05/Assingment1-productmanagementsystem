
import type { Config } from 'jest';
import "@testing-library/jest-dom";
import nextJest from 'next/jest.js';


const createJestConfig = nextJest({

  dir: './',

});


const customJestConfig: Config = {

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],


  testEnvironment: 'jsdom',


  testMatch: [

    '<rootDir>/tests/**/*.test.js',

    '<rootDir>/tests/**/*.test.jsx',

    '<rootDir>/tests/**/*.test.ts',

    '<rootDir>/tests/**/*.test.tsx',

  ],


  testPathIgnorePatterns: [

    '/node_modules/',

    '/.next/',

  ],

};


export default createJestConfig(customJestConfig);

