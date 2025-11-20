import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Conversation } from '../conversations/conversation.entity';
import { WhatsAppConfig } from '../whatsapp/whatsapp-config.entity';
import { Subscription } from '../payments/subscription.entity';

export enum MerchantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_ONBOARDING = 'pending_onboarding',
  UNDER_REVIEW = 'under_review',
}

export enum BusinessType {
  ECOMMERCE = 'ecommerce',
  RETAIL = 'retail',
  SERVICES = 'services',
  SaaS = 'saas',
  CONSULTING = 'consulting',
  OTHER = 'other',
}

@Entity('merchants')
export class Merchant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  businessName: string;

  @Column({ nullable: true })
  businessDescription: string;

  @Column({
    type: 'enum',
    enum: BusinessType,
    default: BusinessType.OTHER,
  })
  businessType: BusinessType;

  @Column({ nullable: true })
  taxId: string;

  @Column({ nullable: true })
  registrationNumber: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({
    type: 'enum',
    enum: MerchantStatus,
    default: MerchantStatus.PENDING_ONBOARDING,
  })
  status: MerchantStatus;

  @Column({ default: true })
  isVerified: boolean;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true })
  kycDocuments: string[]; // URLs to uploaded documents

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  banner: string;

  @Column({ nullable: true })
  primaryColor: string;

  @Column({ nullable: true })
  secondaryColor: string;

  @Column({ nullable: true })
  timezone: string;

  @Column({ default: 'en' })
  defaultLanguage: string;

  @Column('simple-array', { nullable: true })
  supportedLanguages: string[];

  @Column('json', { nullable: true })
  workingHours: {
    [key: string]: {
      open: string;
      close: string;
      closed?: boolean;
    };
  };

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @Column('json', { nullable: true })
  aiConfiguration: {
    model: string;
    temperature: number;
    maxTokens: number;
    promptTemplate: string;
    customInstructions: string;
    handoffThreshold: number;
  };

  @Column('json', { nullable: true })
  salesSettings: {
    currency: string;
    taxRate: number;
    discountCodes: Array<{
      code: string;
      percentage: number;
      maxUses: number;
      expiresAt?: Date;
    }>;
    minimumOrderValue: number;
    maximumOrderValue: number;
  };

  @Column('json', { nullable: true })
  notificationSettings: {
    email: boolean;
    sms: boolean;
    push: boolean;
    webhook: string;
    events: string[];
  };

  @Column({ default: 0 })
  monthlyMessageQuota: number;

  @Column({ default: 0 })
  monthlyMessagesUsed: number;

  @Column({ default: 0 })
  monthlyRevenue: number;

  @Column({ default: 0 })
  totalConversations: number;

  @Column({ default: 0 })
  totalConversions: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  conversionRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  averageOrderValue: number;

  @Column('json', { nullable: true })
  features: {
    aiEnabled: boolean;
    humanHandoff: boolean;
    paymentsEnabled: boolean;
    analyticsEnabled: boolean;
    customBranding: boolean;
    advancedTemplates: boolean;
  };

  // Relations
  @OneToOne(() => User, { 
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => Conversation, (conversation) => conversation.merchant)
  conversations: Conversation[];

  @OneToMany(() => WhatsAppConfig, (config) => config.merchant)
  whatsappConfigs: WhatsAppConfig[];

  @OneToMany(() => Subscription, (subscription) => subscription.merchant)
  subscriptions: Subscription[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get isActive(): boolean {
    return this.status === MerchantStatus.ACTIVE;
  }

  get canSendMessages(): boolean {
    return this.isActive && this.monthlyMessagesUsed < this.monthlyMessageQuota;
  }

  get messagesRemaining(): number {
    return Math.max(0, this.monthlyMessageQuota - this.monthlyMessagesUsed);
  }

  get monthlyUsagePercentage(): number {
    if (this.monthlyMessageQuota === 0) return 0;
    return (this.monthlyMessagesUsed / this.monthlyMessageQuota) * 100;
  }

  get kycCompleted(): boolean {
    return this.isVerified && this.kycDocuments && this.kycDocuments.length > 0;
  }

  updateConversionMetrics(
    revenue: number,
    isConversion: boolean,
  ): void {
    this.monthlyRevenue += revenue;
    this.totalConversations += 1;
    
    if (isConversion) {
      this.totalConversions += 1;
    }
    
    // Recalculate conversion rate
    if (this.totalConversations > 0) {
      this.conversionRate = (this.totalConversions / this.totalConversations) * 100;
    }
    
    // Recalculate average order value
    if (this.totalConversions > 0) {
      this.averageOrderValue = this.monthlyRevenue / this.totalConversions;
    }
  }

  incrementMessageUsage(count: number = 1): void {
    this.monthlyMessagesUsed += count;
  }

  resetMonthlyUsage(): void {
    this.monthlyMessagesUsed = 0;
    this.monthlyRevenue = 0;
  }
}