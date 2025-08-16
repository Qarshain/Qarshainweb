/**
 * Error Handling Middleware for Qarshain Mock Financial API
 * 
 * Provides centralized error handling and consistent error responses
 * across the entire API. Important for financial APIs to have
 * clear, secure error messaging.
 */

/**
 * Custom error class for API errors
 */
class APIError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found handler
 * Called when no route matches the request
 */
const notFound = (req, res, next) => {
  const error = new APIError(
    `Route ${req.originalUrl} not found`,
    404,
    'ROUTE_NOT_FOUND'
  );
  next(error);
};

/**
 * Global error handler
 * Handles all errors thrown in the application
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error details (in production, you'd want to use a proper logging service)
  console.error('❌ Error occurred:');
  console.error(`   URL: ${req.method} ${req.originalUrl}`);
  console.error(`   Message: ${error.message}`);
  console.error(`   Stack: ${err.stack}`);

  // Validation errors (from Joi)
  if (err.name === 'ValidationError' || err.isJoi) {
    const message = err.details 
      ? err.details.map(detail => detail.message).join(', ')
      : 'Validation failed';
    
    error = new APIError(message, 400, 'VALIDATION_ERROR');
  }

  // Mongoose/MongoDB errors (if using MongoDB in the future)
  if (err.name === 'CastError') {
    const message = 'Invalid ID format';
    error = new APIError(message, 400, 'INVALID_ID');
  }

  // Duplicate key error (MongoDB)
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new APIError(message, 400, 'DUPLICATE_FIELD');
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const errorCode = error.code || 'INTERNAL_ERROR';

  // Security: Don't leak sensitive error details in production
  const message = error.isOperational 
    ? error.message 
    : 'Something went wrong on our end';

  // Response format
  const errorResponse = {
    success: false,
    error: {
      message,
      code: errorCode,
      timestamp: new Date().toISOString()
    }
  };

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }

  // Include request ID for tracking (if available)
  if (req.requestId) {
    errorResponse.error.requestId = req.requestId;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Async wrapper to catch errors in async route handlers
 * Usage: asyncHandler(async (req, res, next) => { ... })
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Validation error helper
 */
const validationError = (message, field = null) => {
  const errorMessage = field ? `${field}: ${message}` : message;
  return new APIError(errorMessage, 400, 'VALIDATION_ERROR');
};

/**
 * Not found error helper
 */
const notFoundError = (resource = 'Resource') => {
  return new APIError(`${resource} not found`, 404, 'NOT_FOUND');
};

/**
 * Insufficient funds error (specific to financial APIs)
 */
const insufficientFundsError = (availableBalance) => {
  return new APIError(
    `Insufficient funds. Available balance: ${availableBalance} SAR`,
    400,
    'INSUFFICIENT_FUNDS'
  );
};

/**
 * Business logic error helper
 */
const businessLogicError = (message) => {
  return new APIError(message, 400, 'BUSINESS_LOGIC_ERROR');
};

module.exports = {
  APIError,
  notFound,
  errorHandler,
  asyncHandler,
  validationError,
  notFoundError,
  insufficientFundsError,
  businessLogicError
};