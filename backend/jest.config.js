/**
 * Jest Configuration for Qarshain Mock Financial API
 * 
 * This configuration sets up Jest for testing the Node.js backend
 * with appropriate settings for financial API testing.
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test files pattern
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  
  // Files to include in coverage
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js', // Exclude main server file from coverage
    '!**/node_modules/**'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Test timeout (financial operations should be fast)
  testTimeout: 10000,
  
  // Verbose output for detailed test results
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Force exit after tests complete
  forceExit: true,
  
  // Detect open handles to help debug hanging tests
  detectOpenHandles: true
};