# AutoCloser Agent 🚀

> **AI Sales-Closing Chatbot Platform** - Convert leads into paying customers through automated conversations

[![Build Status](https://github.com/your-org/autocloser-agent/workflows/CI/CD/badge.svg)](https://github.com/your-org/autocloser-agent/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

## 🎯 Overview

AutoCloser Agent is a comprehensive SaaS platform that automates the sales process through AI-powered conversations. It integrates with WhatsApp Business, provides real-time chat capabilities, handles payments, and offers a complete merchant dashboard.

### ✨ Key Features

- **🤖 AI-Powered Conversations**: Intelligent lead qualification and closing scripts
- **📱 WhatsApp Integration**: Native WhatsApp Business API support via Twilio/Meta
- **💳 Payment Processing**: Integrated with iyzico for Turkish market + global payment fallbacks
- **📊 Real-time Analytics**: Conversion tracking, MRR monitoring, conversation insights
- **🔄 Human Handoff**: Seamless transition from AI to human agents when needed
- **📱 Cross-Platform**: Flutter mobile app + React web dashboard
- **🔐 Enterprise Security**: JWT auth, role-based access, audit logging

### 🎯 Target Users

- **SMB Merchants**: E-commerce stores, local shops, service providers
- **Platform Admins**: Managing merchant accounts and platform operations
- **End Customers**: Engaging via WhatsApp/webchat for purchases

## 🏗️ Architecture

```
autocloser-agent/
├── apps/
│   ├── mobile-flutter/          # Flutter mobile app (iOS + Android)
│   ├── web-landing/             # Public marketing website
│   └── admin-react/             # Merchant dashboard (React + TypeScript)
├── services/
│   ├── api-gateway/             # NestJS backend API
│   ├── agents/                  # AI conversation workers
│   └── jobs/                    # Cron jobs & billing services
├── packages/
│   ├── shared/                  # Shared utilities & types
│   └── ui-components/           # Shared UI components
├── infra/
│   ├── terraform/               # AWS infrastructure
│   └── k8s/                     # Kubernetes manifests
└── ci/                          # GitHub Actions workflows
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 14.0
- **Redis** >= 6.0
- **Docker** & Docker Compose
- **Flutter** (for mobile development)
- **Android Studio / Xcode** (for mobile builds)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/autocloser-agent.git
   cd autocloser-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   npm run docker:up
   npm run db:migrate
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

### Production Deployment

1. **Infrastructure Setup**
   ```bash
   cd infra
   ./deploy.sh staging  # or production
   ```

2. **CI/CD Pipeline**
   - Automatic deployment on `main` branch
   - Mobile app stores via Fastlane
   - Production releases tagged as v1.x.x

## 📋 Core Services

### 🏢 API Gateway (NestJS)

- **Authentication**: JWT + refresh tokens, OAuth integration
- **WhatsApp Integration**: Message handling, template management
- **Payment Processing**: iyzico integration, webhook handling
- **User Management**: Merchant onboarding, role-based access
- **Analytics**: Conversion tracking, reporting APIs

### 🤖 AI Agents

- **Conversation Engine**: OpenAI-powered chat responses
- **Lead Qualification**: Automated lead scoring and routing
- **Sales Scripts**: Dynamic pricing, objection handling
- **Human Handoff**: Intelligent escalation triggers

### 📱 Mobile App (Flutter)

- **Beautiful UI**: Pixel-perfect merchant dashboard
- **Real-time Chat**: WebSocket-powered messaging
- **Push Notifications**: Firebase Cloud Messaging
- **Offline Support**: Local data sync capabilities

### 💻 Web Dashboard (React)

- **Merchant Analytics**: MRR, conversion rates, insights
- **Conversation Management**: Review, manual takeover
- **Template Editor**: WhatsApp message templates
- **Settings**: WhatsApp configuration, payment setup

## 🔧 Configuration

### WhatsApp Business Setup

1. **Twilio Configuration**
   ```env
   WHATSAPP_TWILIO_ACCOUNT_SID=your_account_sid
   WHATSAPP_TWILIO_AUTH_TOKEN=your_auth_token
   ```

2. **Meta Cloud API (Alternative)**
   ```env
   META_ACCESS_TOKEN=your_access_token
   META_VERIFY_TOKEN=your_verify_token
   ```

### Payment Integration (iyzico)

```env
IYZIPAY_API_KEY=your_api_key
IYZIPAY_SECRET=your_secret
IYZIPAY_BASE_URL=https://sandbox-api.iyzipay.com
```

### AI Provider (OpenAI)

```env
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4-turbo
```

## 🧪 Testing

### Test Coverage

- **Unit Tests**: Jest/Vitest for all services
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Playwright for web flows
- **Mobile Tests**: Flutter integration tests
- **Load Tests**: Artillery.js for performance

### Run Tests

```bash
# All tests
npm run test

# Specific service
cd services/api-gateway && npm run test

# E2E tests
npm run test:e2e

# Load tests
npm run test:load
```

## 📊 Monitoring & Analytics

### Metrics Dashboard

- **Business KPIs**: MRR, conversion rate, average ticket size
- **Technical Metrics**: Response time, error rate, message throughput
- **Real-time Alerts**: Sentry integration, Grafana dashboards

### Logging & Observability

- **Structured Logging**: JSON format, correlation IDs
- **Distributed Tracing**: Jaeger integration
- **Health Checks**: Automated uptime monitoring
- **Performance Monitoring**: APM integration

## 🔐 Security & Compliance

### Security Features

- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Encryption**: At-rest and in-transit encryption
- **API Security**: Rate limiting, request validation
- **Webhook Verification**: HMAC signature validation

### Compliance

- **GDPR**: Data privacy and user rights
- **KVKK**: Turkish data protection compliance
- **PCI-DSS**: Payment card industry standards (via iyzico)
- **WhatsApp Business**: Meta platform compliance

## 📚 API Documentation

### OpenAPI Specification

Interactive API documentation available at:
- **Staging**: https://staging-api.autocloser.com/docs
- **Production**: https://api.autocloser.com/docs

### Quick API Examples

```bash
# Create conversation
curl -X POST https://api.autocloser.com/conversations \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"channel": "whatsapp", "merchantId": "123"}'

# Get conversation history
curl https://api.autocloser.com/conversations/456/messages \
  -H "Authorization: Bearer $TOKEN"
```

## 🚀 Deployment

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    tags: ['v*']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build & Deploy
        run: ./scripts/deploy.sh
```

### Infrastructure (Terraform)

```bash
# Initialize infrastructure
cd infra/terraform
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

### Mobile App Deployment

```bash
# iOS (TestFlight)
fastlane ios release

# Android (Internal Testing)
fastlane android internal
```

## 📖 Documentation

### User Guides

- [Merchant Onboarding Guide](docs/merchant-onboarding.md)
- [WhatsApp Integration Setup](docs/whatsapp-setup.md)
- [Payment Configuration](docs/payments.md)
- [API Reference](docs/api-reference.md)

### Developer Guides

- [Contributing Guidelines](docs/contributing.md)
- [Architecture Decisions](docs/architecture.md)
- [Database Schema](docs/database.md)
- [Testing Strategy](docs/testing.md)

## 🆘 Support & Troubleshooting

### Common Issues

1. **WhatsApp Webhook Errors**
   ```bash
   # Verify webhook signature
   npm run verify:webhook
   ```

2. **Payment Integration Issues**
   ```bash
   # Test payment flow
   npm run test:payments
   ```

3. **Mobile App Build Issues**
   ```bash
   # Clean and rebuild
   cd apps/mobile-flutter
   flutter clean && flutter pub get
   ```

### Getting Help

- **Documentation**: [docs.autocloser.com](https://docs.autocloser.com)
- **Support Email**: support@autocloser.com
- **GitHub Issues**: [Create an issue](https://github.com/your-org/autocloser-agent/issues)
- **Discord Community**: [Join our Discord](https://discord.gg/autocloser)

## 🎯 Roadmap

### Version 1.1 (Q1 2025)
- [ ] Telegram bot integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (AR, FR, DE)
- [ ] A/B testing for conversation flows

### Version 1.2 (Q2 2025)
- [ ] Instagram DM integration
- [ ] Advanced AI model fine-tuning
- [ ] White-label solutions
- [ ] Advanced segmentation tools

### Version 2.0 (Q3 2025)
- [ ] Voice conversation support
- [ ] AR product visualization
- [ ] Blockchain payment integration
- [ ] Advanced fraud detection

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/contributing.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style

- **TypeScript/JavaScript**: ESLint + Prettier
- **Dart/Flutter**: dartfmt + analysis
- **CSS/SCSS**: Stylelint
- **Documentation**: Markdown linting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for AI capabilities
- [Twilio](https://twilio.com/) for WhatsApp integration
- [iyzico](https://iyzico.com/) for payment processing
- [Flutter](https://flutter.dev/) for mobile development
- [NestJS](https://nestjs.com/) for backend framework

---

**Built with ❤️ by MiniMax Agent**

*Transform your sales process with AI-powered conversations*