export default {
  // Test environment
  testEnvironment: 'jsdom',
  
  // File extensions to treat as ESM
  extensionsToTreatAsEsm: ['.ts', '.vue'],
  
  // Transform configuration
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'babel-jest'
  },
  
  // Test file patterns
  testMatch: [
    '**/src/**/__tests__/**/*.(js|ts)',
    '**/src/**/*.(test|spec).(js|ts)'
  ],
  
  // File extensions Jest will look for
  moduleFileExtensions: ['vue', 'js', 'ts', 'json'],
  
  // Module name mapping for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // Paths to ignore during testing
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/cypress/',
    '<rootDir>/dist/'
  ],
  
  // Coverage collection
  collectCoverageFrom: [
    'src/**/*.{js,ts,vue}',
    '!src/main.ts',
    '!src/**/*.d.ts',
    '!src/test-setup.ts'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  
  // Test environment options
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  
  // Global configuration for Vue
  globals: {
    'vue-jest': {
      useESM: true
    }
  },
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Reset modules between tests
  resetModules: true,
  
  // Verbose output
  verbose: true
}
