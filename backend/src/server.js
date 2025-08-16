/**
 * Qarshain Mock Financial Transaction Backend
 * 
 * This is a demonstration backend for a Saudi Arabian fintech MVP
 * simulating wallet and peer-to-peer transfers for testing purposes.
 * 
 * NOTE: This system uses mock data and is NOT connected to real banking systems.
 * It's designed for development, testing, and regulatory demonstration purposes only.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Import our routes and middleware
const transferRoutes = require('./routes/transfers');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const { errorHandler, notFound } = require('./middleware/errorHandling');
const { logger } = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting - Important for financial APIs
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourfrontend.com'] 
    : ['http://localhost:3000', 'http://localhost:8081'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Custom logging middleware
app.use(logger);

// Swagger configuration for API documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Qarshain Mock Financial API',
      version: '1.0.0',
      description: `
        Mock financial transaction backend for Qarshain fintech MVP in Saudi Arabia.
        
        **IMPORTANT NOTICE**: This is a demonstration system using mock data only.
        No real money or banking transactions are processed through this API.
        
        This system simulates:
        - User wallet balances (in Saudi Riyals)
        - Peer-to-peer money transfers
        - Transaction logging and history
        
        Designed for development, testing, and regulatory demonstration purposes.
      `,
      contact: {
        name: 'Qarshain Development Team',
        email: 'dev@qarshain.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique user identifier'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            balance: {
              type: 'number',
              description: 'Current wallet balance in Saudi Riyals (SAR)'
            }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique transaction identifier'
            },
            from: {
              type: 'string',
              description: 'Sender user ID'
            },
            to: {
              type: 'string',
              description: 'Recipient user ID'
            },
            amount: {
              type: 'number',
              description: 'Transfer amount in Saudi Riyals (SAR)'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Transaction timestamp'
            },
            status: {
              type: 'string',
              enum: ['completed', 'failed'],
              description: 'Transaction status'
            }
          }
        },
        TransferRequest: {
          type: 'object',
          required: ['from', 'to', 'amount'],
          properties: {
            from: {
              type: 'string',
              description: 'Sender user ID'
            },
            to: {
              type: 'string',
              description: 'Recipient user ID'
            },
            amount: {
              type: 'number',
              minimum: 0.01,
              description: 'Transfer amount in Saudi Riyals (SAR)'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'], // Path to the API files
};

const specs = swaggerJsdoc(swaggerOptions);

// Swagger UI endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Qarshain Mock Financial API Documentation'
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Qarshain Mock Financial Backend',
    version: '1.0.0'
  });
});

// API routes
app.use('/api/v1', transferRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', transactionRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Qarshain Mock Financial Transaction Backend',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health',
    notice: 'This is a demonstration system with mock data only. No real financial transactions are processed.'
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🏦 Qarshain Mock Financial Backend Started');
  console.log('='.repeat(50));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('⚠️  NOTICE: This is a mock system for development/testing only');
  console.log('   No real financial transactions are processed');
  console.log('='.repeat(50));
});

module.exports = app;