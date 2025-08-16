/**
 * Logging Middleware for Qarshain Mock Financial API
 * 
 * Provides request/response logging for audit trail purposes.
 * In production financial systems, comprehensive logging is
 * essential for compliance and security monitoring.
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Request logging middleware
 * Logs all incoming requests with unique request IDs for tracking
 */
const logger = (req, res, next) => {
  // Generate unique request ID for tracking
  req.requestId = uuidv4();
  
  // Record request start time
  req.startTime = Date.now();
  
  // Log request details
  console.log('📥 Incoming Request:');
  console.log(`   Request ID: ${req.requestId}`);
  console.log(`   Method: ${req.method}`);
  console.log(`   URL: ${req.originalUrl}`);
  console.log(`   IP: ${req.ip || req.connection.remoteAddress}`);
  console.log(`   User-Agent: ${req.get('User-Agent') || 'Unknown'}`);
  console.log(`   Timestamp: ${new Date().toISOString()}`);
  
  // Log request body for POST/PUT requests (be careful with sensitive data)
  if (req.method !== 'GET' && req.body && Object.keys(req.body).length > 0) {
    // Mask sensitive fields for security
    const safeBody = maskSensitiveData(req.body);
    console.log(`   Body: ${JSON.stringify(safeBody, null, 2)}`);
  }
  
  // Override res.json to log responses
  const originalJson = res.json;
  res.json = function(data) {
    const responseTime = Date.now() - req.startTime;
    
    console.log('📤 Outgoing Response:');
    console.log(`   Request ID: ${req.requestId}`);
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Response Time: ${responseTime}ms`);
    console.log(`   Timestamp: ${new Date().toISOString()}`);
    
    // Log response data (mask sensitive information)
    if (data) {
      const safeResponse = maskSensitiveData(data);
      console.log(`   Response: ${JSON.stringify(safeResponse, null, 2)}`);
    }
    
    console.log('─'.repeat(80));
    
    return originalJson.call(this, data);
  };
  
  next();
};

/**
 * Mask sensitive data in logs
 * Replaces sensitive fields with masked values for security
 */
function maskSensitiveData(data) {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'key',
    'authorization',
    'credit_card',
    'ssn',
    'national_id'
  ];
  
  const masked = JSON.parse(JSON.stringify(data));
  
  function maskObject(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const lowerKey = key.toLowerCase();
        
        if (sensitiveFields.some(field => lowerKey.includes(field))) {
          obj[key] = '***MASKED***';
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          maskObject(obj[key]);
        }
      }
    }
  }
  
  maskObject(masked);
  return masked;
}

/**
 * Performance monitoring middleware
 * Logs slow requests for performance monitoring
 */
const performanceMonitor = (threshold = 1000) => {
  return (req, res, next) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      
      if (responseTime > threshold) {
        console.warn('🐌 Slow Request Detected:');
        console.warn(`   Request ID: ${req.requestId}`);
        console.warn(`   URL: ${req.method} ${req.originalUrl}`);
        console.warn(`   Response Time: ${responseTime}ms (threshold: ${threshold}ms)`);
        console.warn(`   Status: ${res.statusCode}`);
      }
    });
    
    next();
  };
};

/**
 * Error logging function
 * Specialized logging for error events
 */
const logError = (error, req = null) => {
  console.error('🚨 Error Event:');
  console.error(`   Message: ${error.message}`);
  console.error(`   Code: ${error.code || 'UNKNOWN'}`);
  console.error(`   Timestamp: ${new Date().toISOString()}`);
  
  if (req) {
    console.error(`   Request ID: ${req.requestId}`);
    console.error(`   URL: ${req.method} ${req.originalUrl}`);
    console.error(`   IP: ${req.ip || req.connection.remoteAddress}`);
  }
  
  if (error.stack) {
    console.error(`   Stack: ${error.stack}`);
  }
  
  console.error('─'.repeat(80));
};

/**
 * Transaction logging function
 * Specialized logging for financial transactions
 */
const logTransaction = (transactionData, status) => {
  console.log('💰 Transaction Event:');
  console.log(`   Transaction ID: ${transactionData.id}`);
  console.log(`   From: ${transactionData.from}`);
  console.log(`   To: ${transactionData.to}`);
  console.log(`   Amount: ${transactionData.amount} SAR`);
  console.log(`   Status: ${status}`);
  console.log(`   Timestamp: ${transactionData.timestamp}`);
  console.log('─'.repeat(80));
};

module.exports = {
  logger,
  performanceMonitor,
  logError,
  logTransaction,
  maskSensitiveData
};