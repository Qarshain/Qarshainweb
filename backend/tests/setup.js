/**
 * Jest Test Setup File
 * 
 * This file runs before all tests and sets up the testing environment
 * for the Qarshain Mock Financial API.
 */

// Suppress console logs during testing (optional)
// Uncomment the following lines to reduce noise in test output
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Set test environment variables
process.env.NODE_ENV = 'test';

// Global test timeout
jest.setTimeout(10000);

// Global beforeAll setup
beforeAll(() => {
  console.log('🧪 Starting Qarshain API Test Suite');
  console.log('='.repeat(50));
});

// Global afterAll cleanup
afterAll(() => {
  console.log('='.repeat(50));
  console.log('✅ Qarshain API Test Suite Completed');
});

// Add custom matchers if needed
expect.extend({
  toBeValidSARAmount(received) {
    const pass = typeof received === 'number' && 
                  received >= 0 && 
                  Number.isFinite(received) &&
                  Math.round(received * 100) / 100 === received; // Max 2 decimal places
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid SAR amount`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid SAR amount (positive number with max 2 decimal places)`,
        pass: false,
      };
    }
  },
});

// Global error handler for unhandled promise rejections in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process during tests
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process during tests
});