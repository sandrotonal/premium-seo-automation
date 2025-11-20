import { registerAs } from '@nestjs/config';

export const whatsappConfig = registerAs('whatsapp', () => ({
  provider: process.env.WHATSAPP_PROVIDER || 'twilio', // 'twilio' or 'meta'
  
  twilio: {
    accountSid: process.env.WHATSAPP_TWILIO_ACCOUNT_SID,
    authToken: process.env.WHATSAPP_TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.WHATSAPP_PHONE_NUMBER,
    webhookUrl: process.env.WHATSAPP_TWILIO_WEBHOOK_URL,
  },
  
  meta: {
    accessToken: process.env.META_ACCESS_TOKEN,
    appSecret: process.env.META_APP_SECRET,
    verifyToken: process.env.META_VERIFY_TOKEN,
    webhookSecret: process.env.META_WEBHOOK_SECRET,
    businessAccountId: process.env.META_BUSINESS_ACCOUNT_ID,
    phoneNumberId: process.env.META_PHONE_NUMBER_ID,
  },
  
  features: {
    readReceipts: process.env.WHATSAPP_READ_RECEIPTS === 'true',
    typingIndicators: process.env.WHATSAPP_TYPING_INDICATORS === 'true',
    mediaSupport: process.env.WHATSAPP_MEDIA_SUPPORT === 'true',
    templateMessages: process.env.WHATSAPP_TEMPLATE_MESSAGES === 'true',
  },
  
  limits: {
    maxMessageLength: parseInt(process.env.WHATSAPP_MAX_MESSAGE_LENGTH, 10) || 4096,
    rateLimitPerSecond: parseInt(process.env.WHATSAPP_RATE_LIMIT_PER_SECOND, 10) || 1,
    maxTemplates: parseInt(process.env.WHATSAPP_MAX_TEMPLATES, 10) || 250,
  },
  
  templates: {
    categories: ['ACCOUNT_UPDATE', 'PAYMENT_UPDATE', 'PERSONAL_FINANCE_UPDATE', 'SHIPPING_UPDATE', 'RESERVATION_UPDATE', 'TICKET_UPDATE', 'APPOINTMENT_UPDATE', 'TRANSPORTATION_UPDATE', 'FOLLOW_UP', 'ISSUE_RESOLUTION'],
    languages: ['en_US', 'tr_TR', 'es_ES', 'fr_FR', 'de_DE'],
    requiresApproval: true,
  },
  
  webhook: {
    verificationTimeout: parseInt(process.env.WHATSAPP_WEBHOOK_TIMEOUT, 10) || 10000,
    maxRetries: parseInt(process.env.WHATSAPP_WEBHOOK_RETRIES, 10) || 3,
    retryDelay: parseInt(process.env.WHATSAPP_WEBHOOK_RETRY_DELAY, 10) || 5000,
  },
}));