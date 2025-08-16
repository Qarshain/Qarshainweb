# Qarshain Mock Financial Transaction Backend

A comprehensive mock financial transaction system built for a Saudi Arabian fintech MVP. This backend simulates peer-to-peer money transfers, wallet management, and transaction logging for development, testing, and regulatory demonstration purposes.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express-4.18.2-blue)](https://expressjs.com/)
[![API Documentation](https://img.shields.io/badge/API-Swagger%20Docs-green)](http://localhost:3001/api-docs)
[![Tests](https://img.shields.io/badge/tests-Jest-red)](https://jestjs.io/)

## ⚠️ Important Notice

**This is a demonstration system using mock data only. No real money or banking transactions are processed through this API.** It's designed for development, testing, and regulatory demonstration purposes for SAMA (Saudi Arabian Monetary Authority) compliance reviews.

## 🏗️ Architecture Overview

### Core Components

- **Express.js Server**: RESTful API with comprehensive error handling
- **In-Memory Storage**: Mock database for users and transactions
- **Swagger Documentation**: Interactive API documentation
- **Jest Testing**: Comprehensive test suite covering all scenarios
- **Security Middleware**: Rate limiting, CORS, Helmet security headers
- **Audit Logging**: Transaction and request logging for compliance

### Business Logic

The system implements the following financial business rules:
- Users cannot transfer money to themselves
- Transfers require sufficient sender balance
- All amounts are in Saudi Riyals (SAR) with 2 decimal precision
- Transaction limits: 0.01 SAR minimum, 100,000 SAR maximum
- Complete audit trail for all transactions

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16.0.0 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone or download the backend code**
   ```bash
   # If you have the project in a git repository
   git clone <repository-url>
   cd qarshain-mock-backend
   
   # Or if you have the files locally
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   Or for production mode:
   ```bash
   npm start
   ```

4. **Verify the server is running**
   ```bash
   curl http://localhost:3001/health
   ```

### Initial Data

The system starts with three mock users:

| User ID | Name | Initial Balance (SAR) |
|---------|------|----------------------|
| user-1  | Ahmed Al-Rashid | 1,000.00 |
| user-2  | Fatima Al-Zahra | 500.00 |
| user-3  | Mohammed bin Salman | 750.00 |

## 📚 API Documentation

### Interactive Documentation
Once the server is running, visit: **http://localhost:3001/api-docs**

### Core Endpoints

#### 🏥 Health Check
```http
GET /health
```
Returns server health status and basic information.

#### 👥 User Management
```http
GET /api/v1/users
GET /api/v1/users/{userId}
GET /api/v1/users/{userId}/balance
```

#### 💰 Money Transfers
```http
POST /api/v1/transfer
```

**Request Body:**
```json
{
  "from": "user-1",
  "to": "user-2", 
  "amount": 100.50
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Transfer completed successfully",
  "data": {
    "transaction": {
      "id": "uuid-here",
      "from": "user-1",
      "to": "user-2",
      "amount": 100.50,
      "timestamp": "2024-01-15T10:30:00.000Z",
      "status": "completed"
    },
    "balances": {
      "sender": { "id": "user-1", "newBalance": 899.50 },
      "recipient": { "id": "user-2", "newBalance": 600.50 }
    }
  }
}
```

#### 📊 Transaction History
```http
GET /api/v1/transactions
GET /api/v1/transactions/{transactionId}
GET /api/v1/transactions/user/{userId}
GET /api/v1/transactions/statistics
```

### Query Parameters

**Pagination & Filtering:**
- `limit`: Maximum results (default: 50, max: 500)
- `offset`: Skip results for pagination (default: 0)
- `status`: Filter by 'completed' or 'failed'
- `userId`: Filter transactions for specific user

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test
# Coverage report will be generated in ./coverage/
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Test Scenarios Covered

✅ **Successful Transfers**
- Valid user-to-user transfers
- Decimal precision handling
- Minimum and maximum amounts
- Exact balance transfers

✅ **Error Scenarios**
- Insufficient funds
- Non-existent users
- Self-transfers (not allowed)
- Invalid amounts (negative, zero, too large)
- Missing required fields
- Invalid user ID formats

✅ **Business Logic**
- Balance updates are atomic
- Transaction logging
- User existence validation
- Amount precision (2 decimal places)

✅ **API Functionality**
- All endpoint responses
- Pagination and filtering
- Error handling and status codes
- Request validation

## 🔧 Development

### Project Structure
```
backend/
├── src/
│   ├── data/
│   │   └── storage.js          # In-memory data storage
│   ├── middleware/
│   │   ├── errorHandling.js    # Error handling & custom errors
│   │   └── logger.js           # Request/response logging
│   ├── routes/
│   │   ├── transfers.js        # Transfer endpoints
│   │   ├── users.js           # User endpoints
│   │   └── transactions.js    # Transaction history endpoints
│   └── server.js              # Main application server
├── tests/
│   ├── api.test.js            # Comprehensive API tests
│   └── setup.js               # Jest test configuration
├── coverage/                   # Test coverage reports
├── package.json
├── jest.config.js
└── README.md
```

### Environment Variables

The system supports the following environment variables:

```bash
# Server Configuration
PORT=3001                    # Server port (default: 3001)
NODE_ENV=development         # Environment (development/production)

# CORS Configuration (production)
CORS_ORIGIN=https://yourfrontend.com
```

### Development Scripts

```bash
npm run dev        # Start development server with nodemon
npm start          # Start production server
npm test           # Run test suite
npm run test:watch # Run tests in watch mode
```

## 🔒 Security Features

### Implemented Security Measures

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable allowed origins
- **Helmet Security**: Various HTTP security headers
- **Input Validation**: Joi schema validation for all inputs
- **Error Masking**: Sensitive data not exposed in error responses
- **Audit Logging**: Complete request/response logging for compliance

### Financial Security Considerations

- **Transaction Atomicity**: Balances updated together or not at all
- **Decimal Precision**: Proper handling of currency amounts (2 decimal places)
- **Business Rules**: Self-transfer prevention, amount limits
- **Audit Trail**: Complete transaction history with timestamps
- **Error Handling**: Graceful failure handling with proper logging

## 📈 Monitoring & Observability

### Request Logging
All requests are logged with:
- Unique request IDs for tracking
- Request/response details
- Performance metrics
- Error details with stack traces

### Transaction Logging
Financial transactions include:
- Transaction IDs
- Participant details
- Amount and timestamp
- Success/failure status
- Audit trail for compliance

### Health Monitoring
```bash
curl http://localhost:3001/health
```

Returns:
- Service status
- Version information
- Timestamp
- System health indicators

## 🚀 Deployment Considerations

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS origins
- [ ] Set up proper logging infrastructure
- [ ] Configure rate limiting for production traffic
- [ ] Set up monitoring and alerting
- [ ] Configure proper error tracking
- [ ] Set up SSL/TLS termination
- [ ] Configure firewall rules

### Scaling Considerations

For production deployment, consider:

1. **Database Migration**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Session Management**: Add proper user authentication/authorization
3. **Load Balancing**: Horizontal scaling with proper session handling
4. **Caching**: Redis for frequently accessed data
5. **Message Queues**: For high-volume transaction processing
6. **Microservices**: Split into user, transaction, and notification services

## 🧪 API Testing Examples

### Using cURL

**Get all users:**
```bash
curl -X GET http://localhost:3001/api/v1/users
```

**Successful transfer:**
```bash
curl -X POST http://localhost:3001/api/v1/transfer \
  -H "Content-Type: application/json" \
  -d '{"from":"user-1","to":"user-2","amount":100.50}'
```

**Check user balance:**
```bash
curl -X GET http://localhost:3001/api/v1/users/user-1/balance
```

**Get transaction history:**
```bash
curl -X GET "http://localhost:3001/api/v1/transactions?limit=10"
```

### Using JavaScript/Fetch

```javascript
// Transfer money
const transfer = await fetch('http://localhost:3001/api/v1/transfer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    from: 'user-1',
    to: 'user-2',
    amount: 100.50
  })
});

const result = await transfer.json();
console.log(result);
```

## 🆘 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process using port 3001
npx kill-port 3001

# Or change port
PORT=3002 npm run dev
```

**Dependencies not installing:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Tests failing:**
```bash
# Run tests in verbose mode
npm test -- --verbose

# Run specific test file
npm test -- api.test.js
```

### Debug Mode

Enable debug logging:
```bash
NODE_ENV=development npm run dev
```

## 📞 Support & Contact

For questions, issues, or regulatory inquiries:

- **Development Team**: dev@qarshain.com
- **API Documentation**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

## 📄 License

MIT License - See LICENSE file for details.

---

**Qarshain Development Team**  
*Building the future of fintech in Saudi Arabia*

> **Reminder**: This is a mock system for demonstration purposes only. No real financial transactions are processed.