/**
 * Transfer Routes - POST /api/v1/transfer
 * 
 * Handles peer-to-peer money transfers between users.
 * This is the core functionality of the mock financial system.
 */

const express = require('express');
const Joi = require('joi');
const { userStorage, transactionStorage } = require('../data/storage');
const { 
  asyncHandler, 
  insufficientFundsError, 
  notFoundError, 
  businessLogicError,
  validationError 
} = require('../middleware/errorHandling');
const { logTransaction } = require('../middleware/logger');

const router = express.Router();

/**
 * Transfer validation schema
 * Defines the structure and constraints for transfer requests
 */
const transferSchema = Joi.object({
  from: Joi.string()
    .required()
    .trim()
    .min(1)
    .max(50)
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .messages({
      'string.empty': 'Sender ID is required',
      'string.pattern.base': 'Sender ID contains invalid characters',
      'any.required': 'Sender ID is required'
    }),
  
  to: Joi.string()
    .required()
    .trim()
    .min(1)
    .max(50)
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .messages({
      'string.empty': 'Recipient ID is required',
      'string.pattern.base': 'Recipient ID contains invalid characters',
      'any.required': 'Recipient ID is required'
    }),
  
  amount: Joi.number()
    .required()
    .positive()
    .precision(2)
    .min(0.01)
    .max(100000)
    .messages({
      'number.positive': 'Amount must be a positive number',
      'number.min': 'Minimum transfer amount is 0.01 SAR',
      'number.max': 'Maximum transfer amount is 100,000 SAR',
      'any.required': 'Transfer amount is required'
    })
});

/**
 * @swagger
 * /api/v1/transfer:
 *   post:
 *     summary: Transfer money between users
 *     description: |
 *       Processes a peer-to-peer money transfer between two users.
 *       
 *       **Business Rules:**
 *       - Sender must have sufficient balance
 *       - Sender and recipient must be different users
 *       - Both users must exist in the system
 *       - Amount must be positive and within limits (0.01 - 100,000 SAR)
 *       
 *       **Transaction Process:**
 *       1. Validates request data
 *       2. Checks user existence
 *       3. Verifies sufficient funds
 *       4. Updates balances atomically
 *       5. Records transaction log
 *       
 *     tags:
 *       - Transfers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransferRequest'
 *           examples:
 *             successful_transfer:
 *               summary: Successful Transfer
 *               value:
 *                 from: "user-1"
 *                 to: "user-2"
 *                 amount: 100.50
 *             insufficient_funds:
 *               summary: Insufficient Funds
 *               value:
 *                 from: "user-2"
 *                 to: "user-1"
 *                 amount: 1000.00
 *     responses:
 *       200:
 *         description: Transfer completed successfully
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
 *                   example: "Transfer completed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       $ref: '#/components/schemas/Transaction'
 *                     balances:
 *                       type: object
 *                       properties:
 *                         sender:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             newBalance:
 *                               type: number
 *                         recipient:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             newBalance:
 *                               type: number
 *       400:
 *         description: Bad request (validation error, insufficient funds, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Insufficient funds. Available balance: 500.00 SAR"
 *                     code:
 *                       type: string
 *                       example: "INSUFFICIENT_FUNDS"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/transfer', asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = transferSchema.validate(req.body);
  if (error) {
    throw validationError(error.details[0].message);
  }

  const { from, to, amount } = value;

  // Business rule: Cannot transfer to yourself
  if (from === to) {
    throw businessLogicError('Cannot transfer money to yourself');
  }

  // Check if sender exists
  const sender = userStorage.getUserById(from);
  if (!sender) {
    throw notFoundError(`Sender user '${from}'`);
  }

  // Check if recipient exists
  const recipient = userStorage.getUserById(to);
  if (!recipient) {
    throw notFoundError(`Recipient user '${to}'`);
  }

  // Check sufficient funds
  if (sender.balance < amount) {
    throw insufficientFundsError(sender.balance);
  }

  // Perform the transfer (atomic operation simulation)
  try {
    // Calculate new balances
    const newSenderBalance = parseFloat((sender.balance - amount).toFixed(2));
    const newRecipientBalance = parseFloat((recipient.balance + amount).toFixed(2));

    // Update balances
    const senderUpdateSuccess = userStorage.updateUserBalance(from, newSenderBalance);
    const recipientUpdateSuccess = userStorage.updateUserBalance(to, newRecipientBalance);

    if (!senderUpdateSuccess || !recipientUpdateSuccess) {
      throw new Error('Failed to update user balances');
    }

    // Record successful transaction
    const transaction = transactionStorage.addTransaction({
      from,
      to,
      amount,
      status: 'completed'
    });

    // Log transaction for audit trail
    logTransaction(transaction, 'COMPLETED');

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Transfer completed successfully',
      data: {
        transaction: {
          id: transaction.id,
          from: transaction.from,
          to: transaction.to,
          amount: transaction.amount,
          timestamp: transaction.timestamp,
          status: transaction.status
        },
        balances: {
          sender: {
            id: from,
            newBalance: newSenderBalance
          },
          recipient: {
            id: to,
            newBalance: newRecipientBalance
          }
        }
      }
    });

  } catch (error) {
    // Record failed transaction
    const failedTransaction = transactionStorage.addTransaction({
      from,
      to,
      amount,
      status: 'failed'
    });

    // Log failed transaction
    logTransaction(failedTransaction, 'FAILED');

    throw businessLogicError('Transfer failed due to system error');
  }
}));

/**
 * @swagger
 * /api/v1/transfer/simulate-error:
 *   post:
 *     summary: Simulate transfer error (Testing endpoint)
 *     description: |
 *       Testing endpoint that intentionally fails to demonstrate error handling.
 *       This endpoint is useful for testing error scenarios and should be
 *       removed or disabled in production environments.
 *     tags:
 *       - Transfers
 *       - Testing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransferRequest'
 *     responses:
 *       500:
 *         description: Simulated error
 */
router.post('/transfer/simulate-error', asyncHandler(async (req, res) => {
  // This endpoint is for testing error handling
  throw new Error('Simulated transfer error for testing purposes');
}));

module.exports = router;