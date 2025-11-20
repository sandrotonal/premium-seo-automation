# AutoCloser Agent - Quick Start Guide

## 🚀 **Get Started in 5 Minutes**

This guide will get you up and running with the AutoCloser Agent platform locally.

### **Prerequisites**

Ensure you have the following installed:
- **Node.js** (v18+)
- **Docker** & **Docker Compose**
- **Git**
- **PostgreSQL** (optional, Docker will handle this)

### **1. Clone & Setup**

```bash
# Clone the repository
git clone <repository-url>
cd autocloser-agent

# Copy environment configuration
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

### **2. Environment Configuration**

Update the `.env` file with your settings:

```env
# Database (auto-configured by Docker)
DATABASE_HOST=localhost
DATABASE_USER=autocloser
DATABASE_PASSWORD=password
DATABASE_NAME=autocloser_db

# Redis (auto-configured by Docker)
REDIS_HOST=localhost
REDIS_PASSWORD=password

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# OpenAI (for AI conversations)
OPENAI_API_KEY=your_openai_api_key

# WhatsApp Integration (Optional for testing)
# Twilio
WHATSAPP_TWILIO_ACCOUNT_SID=your_twilio_account_sid
WHATSAPP_TWILIO_AUTH_TOKEN=your_twilio_auth_token

# Meta Cloud API (Alternative)
META_ACCESS_TOKEN=your_meta_access_token
META_VERIFY_TOKEN=your_meta_verify_token

# Payment Processing (Optional)
IYZIPAY_API_KEY=your_iyzico_api_key
IYZIPAY_SECRET=your_iyzico_secret
```

### **3. Start Development Environment**

```bash
# Start all services (PostgreSQL, Redis, API, Admin Dashboard)
docker-compose up -d

# Install dependencies
npm install

# Start development servers
npm run dev
```

**That's it!** Your platform is now running:

- **🌐 API Gateway**: http://localhost:3000
- **📚 API Documentation**: http://localhost:3000/docs
- **💻 Admin Dashboard**: http://localhost:5173
- **🏥 Health Check**: http://localhost:3000/health

### **4. Development Tools**

Additional services are available:

- **📊 pgAdmin**: http://localhost:5050 (admin@autocloser.com / admin123)
- **📧 MailHog**: http://localhost:8025 (Email testing interface)
- **🔴 Redis Commander**: http://localhost:8081 (Redis GUI)

### **5. Test the API**

```bash
# Health check
curl http://localhost:3000/health

# Register a user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "businessName": "Test Business"
  }'
```

## 🛠️ **Development Workflow**

### **Backend Development**

```bash
# API Gateway
cd services/api-gateway
npm run start:dev

# AI Agents
cd services/agents
npm run start

# Background Jobs
cd services/jobs
npm run start
```

### **Frontend Development**

```bash
# React Admin Dashboard
cd apps/admin-react
npm run dev

# Mobile App (Flutter)
cd apps/mobile-flutter
flutter run

# Landing Page
cd apps/web-landing
npm run dev
```

### **Database Management**

```bash
# Create migration
cd services/api-gateway
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Seed database
npm run seed
```

## 🔧 **Testing**

### **Run All Tests**

```bash
# Backend tests
npm run test

# Frontend tests
cd apps/admin-react && npm run test

# E2E tests
npm run test:e2e
```

### **API Testing**

Use the provided Postman collection or test with curl:

```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Get conversations (with token)
curl http://localhost:3000/api/v1/conversations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📦 **Production Deployment**

### **Build for Production**

```bash
# Build all services
npm run build

# Build specific service
cd services/api-gateway && npm run build
```

### **Docker Deployment**

```bash
# Build images
docker-compose build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### **Cloud Deployment**

```bash
# Deploy to AWS
cd infra
./deploy.sh staging

# Or production
./deploy.sh prod
```

## 🔐 **Security Setup**

### **Production Checklist**

- [ ] Change all default passwords
- [ ] Configure SSL certificates
- [ ] Set up environment-specific secrets
- [ ] Enable database encryption
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerts
- [ ] Enable audit logging

### **Environment Variables**

Critical production variables:

```env
NODE_ENV=production
DATABASE_SSL=true
JWT_SECRET=<secure-random-string>
REDIS_PASSWORD=<secure-password>
SENTRY_DSN=<sentry-dsn>
```

## 🐛 **Troubleshooting**

### **Common Issues**

**Port Already in Use**
```bash
# Kill process using port
lsof -ti:3000 | xargs kill -9

# Or use different ports
PORT=3001 npm run dev
```

**Database Connection Issues**
```bash
# Check PostgreSQL status
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
npm run migration:run
```

**Redis Connection Issues**
```bash
# Check Redis status
docker-compose logs redis

# Clear Redis cache
redis-cli -h localhost -p 6379 -a password FLUSHALL
```

### **Logs & Debugging**

```bash
# View API logs
docker-compose logs -f api-gateway

# View all service logs
docker-compose logs -f

# Debug mode
LOG_LEVEL=debug npm run dev
```

## 📚 **API Documentation**

### **Swagger UI**
Interactive API documentation is available at:
http://localhost:3000/docs

### **Key Endpoints**

- **Authentication**: `POST /api/v1/auth/login`
- **Merchants**: `GET /api/v1/merchants`
- **Conversations**: `GET /api/v1/conversations`
- **Messages**: `GET /api/v1/messages`
- **Payments**: `POST /api/v1/payments/checkout`

### **WebSocket Events**

Real-time events are available on:
`ws://localhost:3000`

- `conversation:new` - New conversation started
- `message:new` - New message received
- `message:status` - Message delivery status
- `agent:handoff` - Human agent handoff

## 🆘 **Getting Help**

### **Documentation**
- [API Documentation](http://localhost:3000/docs)
- [Database Schema](docs/database.md)
- [Deployment Guide](docs/deployment.md)

### **Support**
- GitHub Issues: Create an issue for bugs or feature requests
- Email: support@autocloser.com
- Discord: Join our developer community

### **Contributing**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

**🎉 Congratulations!** You now have a fully functional AutoCloser Agent development environment. 

**Next Steps:**
1. Explore the API documentation
2. Test the admin dashboard
3. Configure WhatsApp integration
4. Set up payment processing
5. Deploy to production

Happy coding! 🚀