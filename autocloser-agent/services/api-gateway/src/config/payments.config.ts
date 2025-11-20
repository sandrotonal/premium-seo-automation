import { registerAs } from '@nestjs/config';

export const paymentsConfig = registerAs('payments', () => ({
  provider: process.env.PAYMENT_PROVIDER || 'iyzico', // 'iyzico', 'payu', 'stripe'
  
  iyzico: {
    apiKey: process.env.IYZIPAY_API_KEY,
    secretKey: process.env.IYZIPAY_SECRET,
    baseUrl: process.env.IYZIPAY_BASE_URL || 'https://sandbox-api.iyzipay.com',
    webhookSecret: process.env.IYZIPAY_WEBHOOK_SECRET,
    locale: process.env.IYZIPAY_LOCALE || 'en',
    timeout: parseInt(process.env.IYZIPAY_TIMEOUT, 10) || 30000,
    enabled: process.env.PAYMENT_IYZICO_ENABLED === 'true',
  },
  
  payu: {
    merchantId: process.env.PAYU_MERCHANT_ID,
    secretKey: process.env.PAYU_SECRET_KEY,
    clientId: process.env.PAYU_CLIENT_ID,
    environment: process.env.PAYU_ENVIRONMENT || 'sandbox',
    baseUrl: process.env.PAYU_BASE_URL || 'https://sandbox-api.payu.com',
    enabled: process.env.PAYMENT_PAYU_ENABLED === 'true',
  },
  
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    enabled: process.env.PAYMENT_STRIPE_ENABLED === 'true',
  },
  
  features: {
    subscriptions: process.env.PAYMENT_SUBSCRIPTIONS_ENABLED === 'true',
    oneTimePayments: process.env.PAYMENT_ONE_TIME_ENABLED === 'true',
    refunds: process.env.PAYMENT_REFUNDS_ENABLED === 'true',
    partialRefunds: process.env.PAYMENT_PARTIAL_REFUNDS_ENABLED === 'true',
    splitPayments: process.env.PAYMENT_SPLIT_ENABLED === 'true',
  },
  
  currencies: {
    primary: process.env.PAYMENT_PRIMARY_CURRENCY || 'TRY',
    supported: process.env.PAYMENT_SUPPORTED_CURRENCIES?.split(',') || ['TRY', 'USD', 'EUR'],
  },
  
  limits: {
    minAmount: parseFloat(process.env.PAYMENT_MIN_AMOUNT) || 1.0,
    maxAmount: parseFloat(process.env.PAYMENT_MAX_AMOUNT) || 10000.0,
    dailyLimit: parseFloat(process.env.PAYMENT_DAILY_LIMIT) || 50000.0,
  },
  
  webhooks: {
    enabled: process.env.PAYMENT_WEBHOOKS_ENABLED === 'true',
    timeout: parseInt(process.env.PAYMENT_WEBHOOK_TIMEOUT, 10) || 10000,
    maxRetries: parseInt(process.env.PAYMENT_WEBHOOK_RETRIES, 10) || 3,
    retryDelay: parseInt(process.env.PAYMENT_WEBHOOK_RETRY_DELAY, 10) || 5000,
  },
  
  fees: {
    platform: parseFloat(process.env.PAYMENT_PLATFORM_FEE) || 0.029, // 2.9%
    currency: process.env.PAYMENT_FEE_CURRENCY || 'TRY',
  },
  
  security: {
    requireSSL: process.env.PAYMENT_REQUIRE_SSL === 'true',
    enable3DS: process.env.PAYMENT_ENABLE_3DS !== 'false',
    tokenization: process.env.PAYMENT_TOKENIZATION_ENABLED === 'true',
  },
}));