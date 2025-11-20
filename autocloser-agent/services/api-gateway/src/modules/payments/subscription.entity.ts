import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Merchant } from '../merchants/merchant.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PAST_DUE = 'past_due',
  TRIALING = 'trialing',
  UNPAID = 'unpaid',
  INCOMPLETE = 'incomplete',
}

export enum SubscriptionPlan {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
  CUSTOM = 'custom',
}

export enum BillingInterval {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

@Entity('subscriptions')
@Index(['userId', 'status'])
@Index(['merchantId', 'status'])
@Index(['nextBillingDate'])
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  merchantId: string;

  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
    default: SubscriptionPlan.STARTER,
  })
  plan: SubscriptionPlan;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column({
    type: 'enum',
    enum: BillingInterval,
    default: BillingInterval.MONTHLY,
  })
  billingInterval: BillingInterval;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'TRY' })
  currency: string;

  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  taxRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column()
  startedAt: Date;

  @Column()
  currentPeriodStart: Date;

  @Column()
  currentPeriodEnd: Date;

  @Column({ nullable: true })
  nextBillingDate: Date;

  @Column({ nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  trialEnd: Date;

  @Column({ default: false })
  isTrial: boolean;

  @Column({ nullable: true })
  trialUsedDays: number;

  @Column('json', { nullable: true })
  planFeatures: {
    maxConversations: number;
    maxMessages: number;
    aiEnabled: boolean;
    humanHandoff: boolean;
    analytics: boolean;
    customBranding: boolean;
    prioritySupport: boolean;
    apiAccess: boolean;
    webhookSupport: boolean;
  };

  @Column('json', { nullable: true })
  usage: {
    conversationsThisPeriod: number;
    messagesThisPeriod: number;
    aiResponses: number;
    humanHandovers: number;
    apiCalls: number;
    lastResetAt: Date;
  };

  @Column({ nullable: true })
  paymentProviderId: string; // External subscription ID

  @Column({ nullable: true })
  paymentProvider: string; // 'iyzico', 'stripe', etc.

  @Column('json', { nullable: true })
  paymentMetadata: Record<string, any>;

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @Column('json', { nullable: true })
  discounts: Array<{
    code: string;
    percentage: number;
    amount: number;
    validUntil?: Date;
    appliedAt: Date;
  }>;

  // Relations
  @ManyToOne(() => User, (user) => user.subscriptions, {
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Merchant, (merchant) => merchant.subscriptions)
  @JoinColumn({ name: 'merchantId' })
  merchant: Merchant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get isActive(): boolean {
    return this.status === SubscriptionStatus.ACTIVE;
  }

  get isTrialing(): boolean {
    return this.status === SubscriptionStatus.TRIALING;
  }

  get isCancelled(): boolean {
    return this.status === SubscriptionStatus.CANCELLED;
  }

  get isExpired(): boolean {
    return this.status === SubscriptionStatus.EXPIRED;
  }

  get isPastDue(): boolean {
    return this.status === SubscriptionStatus.PAST_DUE;
  }

  get daysUntilRenewal(): number {
    if (!this.nextBillingDate) return 0;
    const now = new Date();
    const diff = this.nextBillingDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  get isRenewalDue(): boolean {
    return this.daysUntilRenewal <= 3;
  }

  get usagePercentage(): {
    conversations: number;
    messages: number;
  } {
    const maxConversations = this.planFeatures?.maxConversations || 0;
    const maxMessages = this.planFeatures?.maxMessages || 0;
    
    return {
      conversations: maxConversations ? (this.usage?.conversationsThisPeriod || 0) / maxConversations * 100 : 0,
      messages: maxMessages ? (this.usage?.messagesThisPeriod || 0) / maxMessages * 100 : 0,
    };
  }

  get hasExceededLimits(): boolean {
    const usage = this.usagePercentage;
    return usage.conversations >= 100 || usage.messages >= 100;
  }

  cancel(reason?: string): void {
    this.status = SubscriptionStatus.CANCELLED;
    this.cancelledAt = new Date();
    
    if (!this.metadata) {
      this.metadata = {};
    }
    this.metadata.cancellationReason = reason;
  }

  renew(): void {
    this.currentPeriodStart = this.currentPeriodEnd;
    
    // Calculate next period based on billing interval
    const interval = this.billingInterval;
    let nextEnd = new Date(this.currentPeriodStart);
    
    switch (interval) {
      case BillingInterval.MONTHLY:
        nextEnd.setMonth(nextEnd.getMonth() + 1);
        break;
      case BillingInterval.QUARTERLY:
        nextEnd.setMonth(nextEnd.getMonth() + 3);
        break;
      case BillingInterval.YEARLY:
        nextEnd.setFullYear(nextEnd.getFullYear() + 1);
        break;
    }
    
    this.currentPeriodEnd = nextEnd;
    this.nextBillingDate = nextEnd;
    
    // Reset usage for new period
    this.usage = {
      conversationsThisPeriod: 0,
      messagesThisPeriod: 0,
      aiResponses: 0,
      humanHandovers: 0,
      apiCalls: 0,
      lastResetAt: new Date(),
    };
  }

  upgrade(plan: SubscriptionPlan, amount: number): void {
    this.plan = plan;
    this.amount = amount;
    this.totalAmount = amount + (this.taxAmount || 0);
    
    // Update plan features
    this.updatePlanFeatures(plan);
  }

  applyDiscount(code: string, percentage: number, amount: number, validUntil?: Date): void {
    if (!this.discounts) {
      this.discounts = [];
    }
    
    this.discounts.push({
      code,
      percentage,
      amount,
      validUntil,
      appliedAt: new Date(),
    });
  }

  recordUsage(type: keyof typeof this.usage, count: number = 1): void {
    if (!this.usage) {
      this.usage = {
        conversationsThisPeriod: 0,
        messagesThisPeriod: 0,
        aiResponses: 0,
        humanHandovers: 0,
        apiCalls: 0,
        lastResetAt: new Date(),
      };
    }
    
    if (type in this.usage) {
      this.usage[type] += count;
    }
  }

  private updatePlanFeatures(plan: SubscriptionPlan): void {
    const features = {
      STARTER: {
        maxConversations: 100,
        maxMessages: 1000,
        aiEnabled: true,
        humanHandoff: false,
        analytics: true,
        customBranding: false,
        prioritySupport: false,
        apiAccess: false,
        webhookSupport: false,
      },
      PROFESSIONAL: {
        maxConversations: 1000,
        maxMessages: 10000,
        aiEnabled: true,
        humanHandoff: true,
        analytics: true,
        customBranding: true,
        prioritySupport: true,
        apiAccess: true,
        webhookSupport: true,
      },
      ENTERPRISE: {
        maxConversations: -1, // Unlimited
        maxMessages: -1, // Unlimited
        aiEnabled: true,
        humanHandoff: true,
        analytics: true,
        customBranding: true,
        prioritySupport: true,
        apiAccess: true,
        webhookSupport: true,
      },
      CUSTOM: {
        maxConversations: -1,
        maxMessages: -1,
        aiEnabled: true,
        humanHandoff: true,
        analytics: true,
        customBranding: true,
        prioritySupport: true,
        apiAccess: true,
        webhookSupport: true,
      },
    };
    
    this.planFeatures = features[plan];
  }
}