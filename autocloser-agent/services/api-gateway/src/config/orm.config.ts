import { DataSource } from 'typeorm';
import { User } from '../modules/users/user.entity';
import { Merchant } from '../modules/merchants/merchant.entity';
import { Conversation } from '../modules/conversations/conversation.entity';
import { Message } from '../modules/messages/message.entity';
import { WhatsAppConfig } from '../modules/whatsapp/whatsapp-config.entity';
import { Subscription } from '../modules/payments/subscription.entity';
import { Transaction } from '../modules/payments/transaction.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER || 'autocloser',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'autocloser_db',
  entities: [
    User,
    Merchant,
    Conversation,
    Message,
    WhatsAppConfig,
    Subscription,
    Transaction,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  ssl: process.env.DATABASE_SSL === 'true',
  logging: process.env.NODE_ENV === 'development',
});

export default dataSource;