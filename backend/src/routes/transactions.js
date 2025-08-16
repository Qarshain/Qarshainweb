/**
 * Transaction Routes - GET /api/v1/transactions
 * 
 * Handles transaction-related endpoints including transaction history,
 * individual transaction details, and transaction statistics.
 */

const express = require('express');
const { transactionStorage, userStorage } = require('../data/storage');
const { asyncHandler, notFoundError } = require('../middleware/errorHandling');

const router = express.Router();

/**
 * @swagger
 * /api/v1/transactions:
 *   get:
 *     summary: Get all transactions
 *     description: |
 *       Retrieves a list of all transactions in the system, sorted by timestamp (newest first).
 *       
 *       **Use Cases:**
 *       - Transaction history views
 *       - Audit trails
 *       - System monitoring
 *       - Compliance reporting
 *       
 *       **Query Parameters:**
 *       - `limit`: Maximum number of transactions to return (default: 50, max: 500)
 *       - `offset`: Number of transactions to skip for pagination (default: 0)
 *       - `status`: Filter by transaction status ('completed' or 'failed')
 *       - `userId`: Filter transactions involving a specific user
 *       
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 500
 *           default: 50
 *         description: Maximum number of transactions to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of transactions to skip
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [completed, failed]
 *         description: Filter by transaction status
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter transactions involving specific user
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Transactions retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactions:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Transaction'
 *                           - type: object
 *                             properties:
 *                               senderName:
 *                                 type: string
 *                               recipientName:
 *                                 type: string
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         offset:
 *                           type: integer
 *                         hasMore:
 *                           type: boolean
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         totalTransactions:
 *                           type: integer
 *                         completedTransactions:
 *                           type: integer
 *                         failedTransactions:
 *                           type: integer
 *                         totalVolume:
 *                           type: number
 *                         successRate:
 *                           type: number
 *       500:
 *         description: Internal server error
 */
router.get('/transactions', asyncHandler(async (req, res) => {
  // Parse query parameters
  const limit = Math.min(parseInt(req.query.limit) || 50, 500);
  const offset = Math.max(parseInt(req.query.offset) || 0, 0);
  const statusFilter = req.query.status;
  const userIdFilter = req.query.userId;
  
  // Get all transactions
  let transactions = transactionStorage.getAllTransactions();
  
  // Apply filters
  if (statusFilter && ['completed', 'failed'].includes(statusFilter)) {
    transactions = transactions.filter(t => t.status === statusFilter);
  }
  
  if (userIdFilter) {
    transactions = transactions.filter(t => t.from === userIdFilter || t.to === userIdFilter);
  }
  
  // Get total count before pagination
  const totalTransactions = transactions.length;
  
  // Apply pagination
  const paginatedTransactions = transactions.slice(offset, offset + limit);
  
  // Enrich transactions with user names
  const enrichedTransactions = paginatedTransactions.map(transaction => {
    const sender = userStorage.getUserById(transaction.from);
    const recipient = userStorage.getUserById(transaction.to);
    
    return {
      ...transaction,
      senderName: sender ? sender.name : 'Unknown User',
      recipientName: recipient ? recipient.name : 'Unknown User'
    };
  });
  
  // Get statistics
  const statistics = transactionStorage.getStatistics();
  
  // Format response
  res.status(200).json({
    success: true,
    message: 'Transactions retrieved successfully',
    data: {
      transactions: enrichedTransactions,
      pagination: {
        total: totalTransactions,
        limit,
        offset,
        hasMore: offset + limit < totalTransactions
      },
      statistics
    }
  });
}));

/**
 * @swagger
 * /api/v1/transactions/{transactionId}:
 *   get:
 *     summary: Get specific transaction details
 *     description: |
 *       Retrieves detailed information for a specific transaction.
 *       
 *       **Use Cases:**
 *       - Transaction receipt generation
 *       - Dispute investigation
 *       - Audit trail verification
 *       
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique transaction identifier
 *     responses:
 *       200:
 *         description: Transaction details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Transaction details retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Transaction'
 *                         - type: object
 *                           properties:
 *                             sender:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                             recipient:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
router.get('/transactions/:transactionId', asyncHandler(async (req, res) => {
  const { transactionId } = req.params;
  
  // Get transaction from storage
  const transaction = transactionStorage.getTransactionById(transactionId);
  
  if (!transaction) {
    throw notFoundError(`Transaction '${transactionId}'`);
  }
  
  // Get user details
  const sender = userStorage.getUserById(transaction.from);
  const recipient = userStorage.getUserById(transaction.to);
  
  // Enrich transaction with user details
  const enrichedTransaction = {
    ...transaction,
    sender: {
      id: transaction.from,
      name: sender ? sender.name : 'Unknown User'
    },
    recipient: {
      id: transaction.to,
      name: recipient ? recipient.name : 'Unknown User'
    }
  };
  
  // Format response
  res.status(200).json({
    success: true,
    message: 'Transaction details retrieved successfully',
    data: {
      transaction: enrichedTransaction
    }
  });
}));

/**
 * @swagger
 * /api/v1/transactions/user/{userId}:
 *   get:
 *     summary: Get transactions for specific user
 *     description: |
 *       Retrieves all transactions involving a specific user (both sent and received).
 *       
 *       **Use Cases:**
 *       - User transaction history
 *       - Account statements
 *       - Personal finance tracking
 *       
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user identifier
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Maximum number of transactions to return
 *     responses:
 *       200:
 *         description: User transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User transactions retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     transactions:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Transaction'
 *                           - type: object
 *                             properties:
 *                               type:
 *                                 type: string
 *                                 enum: [sent, received]
 *                               otherParty:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                   name:
 *                                     type: string
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalTransactions:
 *                           type: integer
 *                         totalSent:
 *                           type: number
 *                         totalReceived:
 *                           type: number
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/transactions/user/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  
  // Check if user exists
  const user = userStorage.getUserById(userId);
  if (!user) {
    throw notFoundError(`User '${userId}'`);
  }
  
  // Get user transactions
  let userTransactions = transactionStorage.getTransactionsByUser(userId);
  
  // Apply limit
  userTransactions = userTransactions.slice(0, limit);
  
  // Enrich transactions with type and other party details
  const enrichedTransactions = userTransactions.map(transaction => {
    const isSender = transaction.from === userId;
    const otherPartyId = isSender ? transaction.to : transaction.from;
    const otherParty = userStorage.getUserById(otherPartyId);
    
    return {
      ...transaction,
      type: isSender ? 'sent' : 'received',
      otherParty: {
        id: otherPartyId,
        name: otherParty ? otherParty.name : 'Unknown User'
      }
    };
  });
  
  // Calculate summary
  const allUserTransactions = transactionStorage.getTransactionsByUser(userId);
  const sentTransactions = allUserTransactions.filter(t => t.from === userId && t.status === 'completed');
  const receivedTransactions = allUserTransactions.filter(t => t.to === userId && t.status === 'completed');
  
  const totalSent = sentTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalReceived = receivedTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Format response
  res.status(200).json({
    success: true,
    message: 'User transactions retrieved successfully',
    data: {
      user: {
        id: user.id,
        name: user.name
      },
      transactions: enrichedTransactions,
      summary: {
        totalTransactions: allUserTransactions.length,
        totalSent: parseFloat(totalSent.toFixed(2)),
        totalReceived: parseFloat(totalReceived.toFixed(2))
      }
    }
  });
}));

/**
 * @swagger
 * /api/v1/transactions/statistics:
 *   get:
 *     summary: Get transaction statistics
 *     description: |
 *       Retrieves comprehensive statistics about all transactions in the system.
 *       
 *       **Use Cases:**
 *       - Admin dashboards
 *       - Business intelligence
 *       - Performance monitoring
 *       - Compliance reporting
 *       
 *     tags:
 *       - Transactions
 *       - Statistics
 *     responses:
 *       200:
 *         description: Transaction statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Transaction statistics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         totalTransactions:
 *                           type: integer
 *                           description: Total number of transactions
 *                         completedTransactions:
 *                           type: integer
 *                           description: Number of successful transactions
 *                         failedTransactions:
 *                           type: integer
 *                           description: Number of failed transactions
 *                         totalVolume:
 *                           type: number
 *                           description: Total volume of completed transactions in SAR
 *                         successRate:
 *                           type: number
 *                           description: Success rate as percentage
 *                         averageTransactionSize:
 *                           type: number
 *                           description: Average transaction amount in SAR
 *       500:
 *         description: Internal server error
 */
router.get('/transactions/statistics', asyncHandler(async (req, res) => {
  // Get basic statistics
  const statistics = transactionStorage.getStatistics();
  
  // Calculate additional statistics
  const allTransactions = transactionStorage.getAllTransactions();
  const completedTransactions = allTransactions.filter(t => t.status === 'completed');
  
  const averageTransactionSize = completedTransactions.length > 0
    ? parseFloat((statistics.totalVolume / completedTransactions.length).toFixed(2))
    : 0;
  
  // Enhanced statistics
  const enhancedStatistics = {
    ...statistics,
    averageTransactionSize
  };
  
  // Format response
  res.status(200).json({
    success: true,
    message: 'Transaction statistics retrieved successfully',
    data: {
      statistics: enhancedStatistics
    }
  });
}));

module.exports = router;