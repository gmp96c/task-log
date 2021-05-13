export default {
    setupFilesAfterEnv: ['./src/__tests__/jest.setup.tsx'],
  // roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleNameMapper: {
      "\\.(css|sass)$": "identity-obj-proxy",
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testEnvironment: 'jsdom'
};
