import { registerAs } from '@nestjs/config';

export const aiConfig = registerAs('ai', () => ({
  provider: process.env.AI_PROVIDER || 'openai',
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS, 10) || 2000,
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
    timeout: parseInt(process.env.OPENAI_TIMEOUT, 10) || 30000,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
    maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS, 10) || 2000,
    temperature: parseFloat(process.env.ANTHROPIC_TEMPERATURE) || 0.7,
  },
  azure: {
    apiKey: process.env.AZURE_OPENAI_KEY,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4',
    apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-02-01',
  },
  prompts: {
    system: {
      leadQualification: 'You are a professional sales assistant. Your goal is to qualify leads and gather information about customer needs.',
      objectionHandling: 'You are an experienced sales professional. Handle objections with empathy and provide value-driven responses.',
      closing: 'You are an expert closer. Guide the conversation towards a purchase decision while maintaining professionalism.',
    },
    task: {
      leadQuestions: 'Ask 3 qualifying questions to understand the customer\'s needs, budget, and timeline.',
      priceNegotiation: 'Handle pricing discussions professionally. Offer value before discussing discounts.',
      urgency: 'Create appropriate urgency without being pushy or aggressive.',
    },
  },
  safety: {
    maxResponseLength: 1000,
    filterProfanity: true,
    filterPII: true,
    sentimentThreshold: -0.5,
  },
  confidence: {
    handoffThreshold: 0.7,
    escalationTriggers: ['human agent', 'manager', 'supervisor', 'talk to person'],
    maxConversationLength: parseInt(process.env.AI_MAX_CONVERSATION_LENGTH, 10) || 50,
  },
}));