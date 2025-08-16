/**
 * In-Memory Data Storage for Mock Financial System
 * 
 * This module provides in-memory storage for users and transactions.
 * In a production system, this would be replaced with a proper database
 * like PostgreSQL, MongoDB, or a banking-grade database system.
 * 
 * NOTE: All data is lost when the server restarts - this is intentional
 * for a mock/testing environment.
 */

const { v4: uuidv4 } = require('uuid');

/**
 * In-memory user storage
 * Structure: { id: string, name: string, balance: number }
 */
const users = new Map();

/**
 * In-memory transaction storage
 * Structure: { id: string, from: string, to: string, amount: number, timestamp: Date, status: string }
 */
const transactions = new Map();

/**
 * Initialize mock users with starting balances
 * These represent test accounts for demonstration purposes
 */
function initializeMockData() {
  const mockUsers = [
    {
      id: 'user-1',
      name: 'Ahmed Al-Rashid',
      balance: 1000.00 // SAR
    },
    {
      id: 'user-2', 
      name: 'Fatima Al-Zahra',
      balance: 500.00 // SAR
    },
    {
      id: 'user-3',
      name: 'Mohammed bin Salman',
      balance: 750.00 // SAR
    }
  ];

  // Clear existing data and add mock users
  users.clear();
  transactions.clear();
  
  mockUsers.forEach(user => {
    users.set(user.id, user);
  });

  console.log('📊 Mock data initialized:');
  mockUsers.forEach(user => {
    console.log(`   - ${user.name}: ${user.balance} SAR`);
  });
}

/**
 * User management functions
 */
const userStorage = {
  /**
   * Get all users
   * @returns {Array} Array of all users
   */
  getAllUsers() {
    return Array.from(users.values());
  },

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Object|null} User object or null if not found
   */
  getUserById(userId) {
    return users.get(userId) || null;
  },

  /**
   * Update user balance
   * @param {string} userId - User ID
   * @param {number} newBalance - New balance amount
   * @returns {boolean} True if update successful, false if user not found
   */
  updateUserBalance(userId, newBalance) {
    const user = users.get(userId);
    if (!user) {
      return false;
    }
    
    user.balance = parseFloat(newBalance.toFixed(2)); // Ensure 2 decimal places
    users.set(userId, user);
    return true;
  },

  /**
   * Check if user exists
   * @param {string} userId - User ID
   * @returns {boolean} True if user exists
   */
  userExists(userId) {
    return users.has(userId);
  }
};

/**
 * Transaction management functions
 */
const transactionStorage = {
  /**
   * Get all transactions
   * @returns {Array} Array of all transactions, sorted by timestamp (newest first)
   */
  getAllTransactions() {
    const transactionList = Array.from(transactions.values());
    return transactionList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  /**
   * Get transaction by ID
   * @param {string} transactionId - Transaction ID
   * @returns {Object|null} Transaction object or null if not found
   */
  getTransactionById(transactionId) {
    return transactions.get(transactionId) || null;
  },

  /**
   * Add new transaction
   * @param {Object} transactionData - Transaction data
   * @param {string} transactionData.from - Sender user ID
   * @param {string} transactionData.to - Recipient user ID
   * @param {number} transactionData.amount - Transfer amount
   * @param {string} transactionData.status - Transaction status ('completed' | 'failed')
   * @returns {Object} Created transaction object
   */
  addTransaction({ from, to, amount, status }) {
    const transaction = {
      id: uuidv4(),
      from,
      to,
      amount: parseFloat(amount.toFixed(2)),
      timestamp: new Date().toISOString(),
      status
    };

    transactions.set(transaction.id, transaction);
    return transaction;
  },

  /**
   * Get transactions for a specific user (sent or received)
   * @param {string} userId - User ID
   * @returns {Array} Array of transactions involving the user
   */
  getTransactionsByUser(userId) {
    const userTransactions = Array.from(transactions.values())
      .filter(transaction => transaction.from === userId || transaction.to === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return userTransactions;
  },

  /**
   * Get transaction statistics
   * @returns {Object} Transaction statistics
   */
  getStatistics() {
    const allTransactions = Array.from(transactions.values());
    const completedTransactions = allTransactions.filter(t => t.status === 'completed');
    const failedTransactions = allTransactions.filter(t => t.status === 'failed');
    
    const totalVolume = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalTransactions: allTransactions.length,
      completedTransactions: completedTransactions.length,
      failedTransactions: failedTransactions.length,
      totalVolume: parseFloat(totalVolume.toFixed(2)),
      successRate: allTransactions.length > 0 
        ? parseFloat(((completedTransactions.length / allTransactions.length) * 100).toFixed(2))
        : 0
    };
  }
};

/**
 * Database reset function for testing
 */
function resetDatabase() {
  users.clear();
  transactions.clear();
  initializeMockData();
  console.log('🔄 Database reset completed');
}

// Initialize mock data when module is loaded
initializeMockData();

module.exports = {
  userStorage,
  transactionStorage,
  initializeMockData,
  resetDatabase
};