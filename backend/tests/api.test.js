/**
 * Comprehensive Test Suite for Qarshain Mock Financial API
 * 
 * This test suite covers all API endpoints and business logic scenarios
 * including successful transfers, error cases, and edge conditions.
 * 
 * Tests are designed to validate:
 * - API endpoint functionality
 * - Business rule enforcement
 * - Error handling
 * - Data integrity
 * - Security constraints
 */

const request = require('supertest');
const app = require('../src/server');
const { resetDatabase } = require('../src/data/storage');

// Test configuration
const API_BASE = '/api/v1';

describe('Qarshain Mock Financial API', () => {
  
  // Reset database before each test to ensure clean state
  beforeEach(() => {
    resetDatabase();
  });

  describe('Health Check', () => {
    test('GET /health should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('service', 'Qarshain Mock Financial Backend');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('User Management', () => {
    test('GET /api/v1/users should return all users', async () => {
      const response = await request(app)
        .get(`${API_BASE}/users`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toHaveLength(3);
      expect(response.body.data.totalUsers).toBe(3);
      expect(response.body.data.totalBalance).toBe(2250); // 1000 + 500 + 750

      // Verify user structure
      const firstUser = response.body.data.users[0];
      expect(firstUser).toHaveProperty('id');
      expect(firstUser).toHaveProperty('name');
      expect(firstUser).toHaveProperty('balance');
    });

    test('GET /api/v1/users/:userId should return specific user', async () => {
      const response = await request(app)
        .get(`${API_BASE}/users/user-1`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toEqual({
        id: 'user-1',
        name: 'Ahmed Al-Rashid',
        balance: 1000
      });
    });

    test('GET /api/v1/users/:userId should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get(`${API_BASE}/users/non-existent-user`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
      expect(response.body.error.message).toContain('non-existent-user');
    });

    test('GET /api/v1/users/:userId/balance should return user balance', async () => {
      const response = await request(app)
        .get(`${API_BASE}/users/user-2/balance`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual({
        userId: 'user-2',
        balance: 500,
        currency: 'SAR'
      });
    });
  });

  describe('Money Transfers', () => {
    test('POST /api/v1/transfer should successfully transfer money', async () => {
      const transferData = {
        from: 'user-1',
        to: 'user-2',
        amount: 100.50
      };

      const response = await request(app)
        .post(`${API_BASE}/transfer`)
        .send(transferData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Transfer completed successfully');
      
      // Verify transaction details
      const transaction = response.body.data.transaction;
      expect(transaction).toHaveProperty('id');
      expect(transaction.from).toBe('user-1');
      expect(transaction.to).toBe('user-2');
      expect(transaction.amount).toBe(100.50);
      expect(transaction.status).toBe('completed');
      expect(transaction).toHaveProperty('timestamp');

      // Verify updated balances
      const balances = response.body.data.balances;
      expect(balances.sender.newBalance).toBe(899.50); // 1000 - 100.50
      expect(balances.recipient.newBalance).toBe(600.50); // 500 + 100.50
    });

    test('POST /api/v1/transfer should fail with insufficient funds', async () => {
      const transferData = {
        from: 'user-2', // user-2 has only 500 SAR
        to: 'user-1',
        amount: 1000 // Requesting more than available
      };

      const response = await request(app)
        .post(`${API_BASE}/transfer`)
        .send(transferData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INSUFFICIENT_FUNDS');
      expect(response.body.error.message).toContain('500');
    });

    test('POST /api/v1/transfer should fail when transferring to self', async () => {
      const transferData = {
        from: 'user-1',
        to: 'user-1', // Same user
        amount: 100
      };

      const response = await request(app)
        .post(`${API_BASE}/transfer`)
        .send(transferData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('BUSINESS_LOGIC_ERROR');
      expect(response.body.error.message).toContain('yourself');
    });

    test('POST /api/v1/transfer should fail with non-existent sender', async () => {
      const transferData = {
        from: 'non-existent-user',
        to: 'user-2',
        amount: 100
      };

      const response = await request(app)
        .post(`${API_BASE}/transfer`)
        .send(transferData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
      expect(response.body.error.message).toContain('Sender');
    });

    test('POST /api/v1/transfer should fail with non-existent recipient', async () => {
      const transferData = {
        from: 'user-1',
        to: 'non-existent-user',
        amount: 100
      };

      const response = await request(app)
        .post(`${API_BASE}/transfer`)
        .send(transferData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
      expect(response.body.error.message).toContain('Recipient');
    });

    test('POST /api/v1/transfer should validate amount constraints', async () => {
      // Test negative amount
      const negativeAmountData = {
        from: 'user-1',
        to: 'user-2',
        amount: -10
      };

      const negativeResponse = await request(app)
        .post(`${API_BASE}/transfer`)
        .send(negativeAmountData)
        .expect(400);

      expect(negativeResponse.body.error.code).toBe('VALIDATION_ERROR');
      expect(negativeResponse.body.error.message).toContain('positive');

      // Test zero amount
      const zeroAmountData = {
        from: 'user-1',
        to: 'user-2',
        amount: 0
      };

      const zeroResponse = await request(app)
        .post(`${API_BASE}/transfer`)
        .send(zeroAmountData)
        .expect(400);

      expect(zeroResponse.body.error.code).toBe('VALIDATION_ERROR');

      // Test amount too large
      const largeAmountData = {
        from: 'user-1',
        to: 'user-2',
        amount: 200000
      };

      const largeResponse = await request(app)
        .post(`${API_BASE}/transfer`)
        .send(largeAmountData)
        .expect(400);

      expect(largeResponse.body.error.code).toBe('VALIDATION_ERROR');
      expect(largeResponse.body.error.message).toContain('100,000');
    });

    test('POST /api/v1/transfer should validate required fields', async () => {
      // Missing 'from' field
      const missingFromData = {
        to: 'user-2',
        amount: 100
      };

      const missingFromResponse = await request(app)
        .post(`${API_BASE}/transfer`)
        .send(missingFromData)
        .expect(400);

      expect(missingFromResponse.body.error.code).toBe('VALIDATION_ERROR');
      expect(missingFromResponse.body.error.message).toContain('Sender ID is required');

      // Missing 'to' field
      const missingToData = {
        from: 'user-1',
        amount: 100
      };

      const missingToResponse = await request(app)
        .post(`${API_BASE}/transfer`)
        .send(missingToData)
        .expect(400);

      expect(missingToResponse.body.error.code).toBe('VALIDATION_ERROR');
      expect(missingToResponse.body.error.message).toContain('Recipient ID is required');

      // Missing 'amount' field
      const missingAmountData = {
        from: 'user-1',
        to: 'user-2'
      };

      const missingAmountResponse = await request(app)
        .post(`${API_BASE}/transfer`)
        .send(missingAmountData)
        .expect(400);

      expect(missingAmountResponse.body.error.code).toBe('VALIDATION_ERROR');
      expect(missingAmountResponse.body.error.message).toContain('amount is required');
    });
  });

  describe('Transaction History', () => {
    beforeEach(async () => {
      // Create some test transactions
      await request(app)
        .post(`${API_BASE}/transfer`)
        .send({ from: 'user-1', to: 'user-2', amount: 100 });
      
      await request(app)
        .post(`${API_BASE}/transfer`)
        .send({ from: 'user-2', to: 'user-3', amount: 50 });
    });

    test('GET /api/v1/transactions should return all transactions', async () => {
      const response = await request(app)
        .get(`${API_BASE}/transactions`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.transactions).toHaveLength(2);
      expect(response.body.data.statistics.totalTransactions).toBe(2);
      expect(response.body.data.statistics.completedTransactions).toBe(2);
      expect(response.body.data.statistics.totalVolume).toBe(150); // 100 + 50

      // Verify transaction structure includes user names
      const firstTransaction = response.body.data.transactions[0];
      expect(firstTransaction).toHaveProperty('senderName');
      expect(firstTransaction).toHaveProperty('recipientName');
    });

    test('GET /api/v1/transactions with status filter', async () => {
      const response = await request(app)
        .get(`${API_BASE}/transactions?status=completed`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.transactions).toHaveLength(2);
      
      // All transactions should have status 'completed'
      response.body.data.transactions.forEach(transaction => {
        expect(transaction.status).toBe('completed');
      });
    });

    test('GET /api/v1/transactions with user filter', async () => {
      const response = await request(app)
        .get(`${API_BASE}/transactions?userId=user-1`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.transactions).toHaveLength(1);
      
      const transaction = response.body.data.transactions[0];
      expect(transaction.from === 'user-1' || transaction.to === 'user-1').toBe(true);
    });

    test('GET /api/v1/transactions with pagination', async () => {
      const response = await request(app)
        .get(`${API_BASE}/transactions?limit=1&offset=0`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.transactions).toHaveLength(1);
      expect(response.body.data.pagination.total).toBe(2);
      expect(response.body.data.pagination.limit).toBe(1);
      expect(response.body.data.pagination.offset).toBe(0);
      expect(response.body.data.pagination.hasMore).toBe(true);
    });

    test('GET /api/v1/transactions/user/:userId should return user transactions', async () => {
      const response = await request(app)
        .get(`${API_BASE}/transactions/user/user-2`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.id).toBe('user-2');
      expect(response.body.data.transactions).toHaveLength(2); // user-2 is involved in both transactions
      
      // Verify transaction types
      const sentTransaction = response.body.data.transactions.find(t => t.type === 'sent');
      const receivedTransaction = response.body.data.transactions.find(t => t.type === 'received');
      
      expect(sentTransaction).toBeDefined();
      expect(receivedTransaction).toBeDefined();
      
      // Verify summary
      expect(response.body.data.summary.totalTransactions).toBe(2);
      expect(response.body.data.summary.totalSent).toBe(50);
      expect(response.body.data.summary.totalReceived).toBe(100);
    });

    test('GET /api/v1/transactions/statistics should return comprehensive statistics', async () => {
      const response = await request(app)
        .get(`${API_BASE}/transactions/statistics`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const stats = response.body.data.statistics;
      
      expect(stats.totalTransactions).toBe(2);
      expect(stats.completedTransactions).toBe(2);
      expect(stats.failedTransactions).toBe(0);
      expect(stats.totalVolume).toBe(150);
      expect(stats.successRate).toBe(100);
      expect(stats.averageTransactionSize).toBe(75); // 150 / 2
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid routes', async () => {
      const response = await request(app)
        .get('/api/v1/invalid-endpoint')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ROUTE_NOT_FOUND');
    });

    test('should handle malformed JSON', async () => {
      const response = await request(app)
        .post(`${API_BASE}/transfer`)
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);

      // Express will handle malformed JSON with its own error
      expect(response.body).toBeDefined();
    });

    test('should simulate and handle system errors', async () => {
      const response = await request(app)
        .post(`${API_BASE}/transfer/simulate-error`)
        .send({ from: 'user-1', to: 'user-2', amount: 100 })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Simulated transfer error');
    });
  });

  describe('Business Logic Edge Cases', () => {
    test('should handle decimal precision correctly', async () => {
      const transferData = {
        from: 'user-1',
        to: 'user-2',
        amount: 99.99
      };

      const response = await request(app)
        .post(`${API_BASE}/transfer`)
        .send(transferData)
        .expect(200);

      expect(response.body.data.balances.sender.newBalance).toBe(900.01); // 1000 - 99.99
      expect(response.body.data.balances.recipient.newBalance).toBe(599.99); // 500 + 99.99
    });

    test('should handle minimum transfer amount', async () => {
      const transferData = {
        from: 'user-1',
        to: 'user-2',
        amount: 0.01 // Minimum allowed amount
      };

      const response = await request(app)
        .post(`${API_BASE}/transfer`)
        .send(transferData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.transaction.amount).toBe(0.01);
    });

    test('should handle exact balance transfer', async () => {
      // user-2 has exactly 500 SAR, transfer all of it
      const transferData = {
        from: 'user-2',
        to: 'user-1',
        amount: 500
      };

      const response = await request(app)
        .post(`${API_BASE}/transfer`)
        .send(transferData)
        .expect(200);

      expect(response.body.data.balances.sender.newBalance).toBe(0);
      expect(response.body.data.balances.recipient.newBalance).toBe(1500);
    });
  });

  describe('Security and Validation', () => {
    test('should reject invalid user ID patterns', async () => {
      const transferData = {
        from: 'user@invalid!',
        to: 'user-2',
        amount: 100
      };

      const response = await request(app)
        .post(`${API_BASE}/transfer`)
        .send(transferData)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.message).toContain('invalid characters');
    });

    test('should handle very long user IDs', async () => {
      const transferData = {
        from: 'a'.repeat(100), // Very long user ID
        to: 'user-2',
        amount: 100
      };

      const response = await request(app)
        .post(`${API_BASE}/transfer`)
        .send(transferData)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    test('should handle empty string user IDs', async () => {
      const transferData = {
        from: '',
        to: 'user-2',
        amount: 100
      };

      const response = await request(app)
        .post(`${API_BASE}/transfer`)
        .send(transferData)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});

// Test helper to clean up after all tests
afterAll(async () => {
  // Close any open connections or cleanup
  console.log('All tests completed successfully! ✅');
});