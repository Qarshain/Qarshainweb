/**
 * User Routes - GET /api/v1/users
 * 
 * Handles user-related endpoints including listing users and their balances.
 * Provides read-only access to user information for the mock financial system.
 */

const express = require('express');
const { userStorage } = require('../data/storage');
const { asyncHandler, notFoundError } = require('../middleware/errorHandling');

const router = express.Router();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users and their balances
 *     description: |
 *       Retrieves a list of all users in the system along with their current wallet balances.
 *       
 *       **Use Cases:**
 *       - Admin dashboard views
 *       - Balance inquiries
 *       - System monitoring
 *       - Testing and development
 *       
 *       **Note:** In a production system, this endpoint would typically require
 *       proper authentication and authorization, and might be restricted to
 *       admin users only.
 *       
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
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
 *                   example: "Users retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     totalUsers:
 *                       type: integer
 *                       example: 3
 *                     totalBalance:
 *                       type: number
 *                       description: Sum of all user balances in SAR
 *                       example: 2250.00
 *             examples:
 *               users_list:
 *                 summary: Example user list
 *                 value:
 *                   success: true
 *                   message: "Users retrieved successfully"
 *                   data:
 *                     users:
 *                       - id: "user-1"
 *                         name: "Ahmed Al-Rashid"
 *                         balance: 1000.00
 *                       - id: "user-2"
 *                         name: "Fatima Al-Zahra"
 *                         balance: 500.00
 *                       - id: "user-3"
 *                         name: "Mohammed bin Salman"
 *                         balance: 750.00
 *                     totalUsers: 3
 *                     totalBalance: 2250.00
 *       500:
 *         description: Internal server error
 */
router.get('/users', asyncHandler(async (req, res) => {
  // Get all users from storage
  const users = userStorage.getAllUsers();
  
  // Calculate total balance across all users
  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);
  
  // Format response
  res.status(200).json({
    success: true,
    message: 'Users retrieved successfully',
    data: {
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        balance: parseFloat(user.balance.toFixed(2))
      })),
      totalUsers: users.length,
      totalBalance: parseFloat(totalBalance.toFixed(2))
    }
  });
}));

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   get:
 *     summary: Get specific user details
 *     description: |
 *       Retrieves detailed information for a specific user including their current balance.
 *       
 *       **Use Cases:**
 *       - User profile views
 *       - Balance inquiries
 *       - Account verification
 *       
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user identifier
 *         example: "user-1"
 *     responses:
 *       200:
 *         description: User details retrieved successfully
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
 *                   example: "User details retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
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
 *                       example: "User 'invalid-user' not found"
 *                     code:
 *                       type: string
 *                       example: "NOT_FOUND"
 *       500:
 *         description: Internal server error
 */
router.get('/users/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  // Get user from storage
  const user = userStorage.getUserById(userId);
  
  if (!user) {
    throw notFoundError(`User '${userId}'`);
  }
  
  // Format response
  res.status(200).json({
    success: true,
    message: 'User details retrieved successfully',
    data: {
      user: {
        id: user.id,
        name: user.name,
        balance: parseFloat(user.balance.toFixed(2))
      }
    }
  });
}));

/**
 * @swagger
 * /api/v1/users/{userId}/balance:
 *   get:
 *     summary: Get user balance only
 *     description: |
 *       Retrieves only the current balance for a specific user.
 *       This is a lightweight endpoint for quick balance checks.
 *       
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user identifier
 *         example: "user-1"
 *     responses:
 *       200:
 *         description: User balance retrieved successfully
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
 *                   example: "Balance retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "user-1"
 *                     balance:
 *                       type: number
 *                       example: 1000.00
 *                     currency:
 *                       type: string
 *                       example: "SAR"
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/users/:userId/balance', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  // Get user from storage
  const user = userStorage.getUserById(userId);
  
  if (!user) {
    throw notFoundError(`User '${userId}'`);
  }
  
  // Format response
  res.status(200).json({
    success: true,
    message: 'Balance retrieved successfully',
    data: {
      userId: user.id,
      balance: parseFloat(user.balance.toFixed(2)),
      currency: 'SAR'
    }
  });
}));

module.exports = router;