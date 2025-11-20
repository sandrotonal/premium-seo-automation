import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Merchant } from '../merchants/merchant.entity';
import { Message } from '../messages/message.entity';
import { Transaction } from '../payments/transaction.entity';

export enum ConversationChannel {
  WHATSAPP = 'whatsapp',
  WEBCHAT = 'webchat',
  TELEGRAM = 'telegram',
  INSTAGRAM = 'instagram',
}

export enum ConversationStatus {
  ACTIVE = 'active',
  WAITING = 'waiting',
  TRANSFERRED = 'transferred',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
  ERROR = 'error',
}

export enum AgentType {
  AI = 'ai',
  HUMAN = 'human',
  SYSTEM = 'system',
}

export enum ConversationStage {
  GREETING = 'greeting',
  QUALIFICATION = 'qualification',
  PRESENTATION = 'presentation',
  OBJECTION_HANDLING = 'objection_handling',
  CLOSING = 'closing',
  PAYMENT = 'payment',
  COMPLETION = 'completion',
  HANDOFF = 'handoff',
}

@Entity('conversations')
@Index(['merchantId', 'status'])
@Index(['channel', 'status'])
@Index(['createdAt'])
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  merchantId: string;

  @Column({ nullable: true })
  customerId: string; // External customer reference

  @Column({
    type: 'enum',
    enum: ConversationChannel,
    default: ConversationChannel.WHATSAPP,
  })
  channel: ConversationChannel;

  @Column({
    type: 'enum',
    enum: ConversationStatus,
    default: ConversationStatus.ACTIVE,
  })
  status: ConversationStatus;

  @Column({
    type: 'enum',
    enum: ConversationStage,
    default: ConversationStage.GREETING,
  })
  stage: ConversationStage;

  @Column({
    type: 'enum',
    enum: AgentType,
    default: AgentType.AI,
  })
  currentAgentType: AgentType;

  @Column({ nullable: true })
  assignedAgentId: string; // Human agent ID

  @Column({ nullable: true })
  whatsappNumber: string;

  @Column({ nullable: true })
  customerName: string;

  @Column({ nullable: true })
  customerEmail: string;

  @Column('json', { nullable: true })
  customerMetadata: {
    source?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    referrer?: string;
    userAgent?: string;
    location?: {
      country: string;
      city: string;
      timezone: string;
    };
  };

  @Column('json', { nullable: true })
  leadQualification: {
    budget?: {
      min: number;
      max: number;
      currency: string;
    };
    timeline?: string;
    needs?: string[];
    painPoints?: string[];
    decisionMaker?: boolean;
    authority?: boolean;
    intent?: 'low' | 'medium' | 'high';
    score?: number; // 0-100
  };

  @Column('json', { nullable: true })
  businessInfo: {
    industry?: string;
    companySize?: string;
    annualRevenue?: number;
    currentSolution?: string;
    challenges?: string[];
    goals?: string[];
  };

  @Column('json', { nullable: true })
  conversationContext: {
    totalMessages: number;
    aiMessages: number;
    humanMessages: number;
    systemMessages: number;
    averageResponseTime: number; // in seconds
    totalDuration: number; // in seconds
    peakHours?: string[];
    sentiment?: 'positive' | 'neutral' | 'negative';
    confidence?: number; // AI confidence score
  };

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  estimatedValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  actualValue: number;

  @Column({ default: 'TRY' })
  currency: string;

  @Column('simple-array', { nullable: true })
  products: string[];

  @Column('json', { nullable: true })
  customFields: Record<string, any>;

  @Column('json', { nullable: true })
  aiMemory: {
    keyPoints: string[];
    objections: string[];
    preferences: Record<string, any>;
    previousInteractions: Array<{
      date: Date;
      summary: string;
      outcome: string;
    }>;
  };

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  transferredAt: Date;

  @Column({ nullable: true })
  lastActivityAt: Date;

  @Column('json', { nullable: true })
  tags: string[];

  @Column('json', { nullable: true })
  notes: Array<{
    author: string;
    content: string;
    createdAt: Date;
    type: 'internal' | 'customer_facing';
  }>;

  // Relations
  @ManyToOne(() => Merchant, (merchant) => merchant.conversations, {
    eager: true,
  })
  @JoinColumn({ name: 'merchantId' })
  merchant: Merchant;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedAgentId' })
  assignedAgent: User;

  @OneToMany(() => Message, (message) => message.conversation, {
    cascade: true,
    eager: false,
  })
  messages: Message[];

  @OneToMany(() => Transaction, (transaction) => transaction.conversation)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get duration(): number {
    if (this.completedAt) {
      return Math.floor((this.completedAt.getTime() - this.createdAt.getTime()) / 1000);
    }
    if (this.lastActivityAt) {
      return Math.floor((this.lastActivityAt.getTime() - this.createdAt.getTime()) / 1000);
    }
    return Math.floor((Date.now() - this.createdAt.getTime()) / 1000);
  }

  get isActive(): boolean {
    return this.status === ConversationStatus.ACTIVE;
  }

  get isCompleted(): boolean {
    return this.status === ConversationStatus.COMPLETED;
  }

  get isTransferred(): boolean {
    return this.status === ConversationStatus.TRANSFERRED;
  }

  get isAbandoned(): boolean {
    return this.status === ConversationStatus.ABANDONED;
  }

  get conversionRate(): number {
    const context = this.conversationContext;
    if (!context?.totalMessages || context.totalMessages === 0) return 0;
    return (this.actualValue / this.estimatedValue) * 100;
  }

  updateActivity(): void {
    this.lastActivityAt = new Date();
  }

  advanceStage(newStage: ConversationStage): void {
    this.stage = newStage;
    this.updateActivity();
  }

  transferToHuman(agentId: string): void {
    this.currentAgentType = AgentType.HUMAN;
    this.assignedAgentId = agentId;
    this.status = ConversationStatus.TRANSFERRED;
    this.transferredAt = new Date();
    this.stage = ConversationStage.HANDOFF;
    this.updateActivity();
  }

  complete(value?: number): void {
    this.status = ConversationStatus.COMPLETED;
    this.completedAt = new Date();
    if (value !== undefined) {
      this.actualValue = value;
    }
    this.updateActivity();
  }

  abandon(): void {
    this.status = ConversationStatus.ABANDONED;
    this.completedAt = new Date();
    this.updateActivity();
  }

  updateQualification(score: number, data: any): void {
    if (!this.leadQualification) {
      this.leadQualification = {};
    }
    this.leadQualification.score = score;
    Object.assign(this.leadQualification, data);
    
    // Update estimated value based on qualification
    this.estimatedValue = this.calculateEstimatedValue();
    this.updateActivity();
  }

  private calculateEstimatedValue(): number {
    const score = this.leadQualification?.score || 0;
    const budget = this.leadQualification?.budget;
    
    if (budget?.max) {
      return budget.max * (score / 100);
    }
    
    // Default estimation based on score
    return score * 100; // 100 TRY per point
  }

  addNote(author: string, content: string, type: 'internal' | 'customer_facing' = 'internal'): void {
    if (!this.notes) {
      this.notes = [];
    }
    
    this.notes.push({
      author,
      content,
      createdAt: new Date(),
      type,
    });
  }

  addTag(tag: string): void {
    if (!this.tags) {
      this.tags = [];
    }
    
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  removeTag(tag: string): void {
    if (this.tags) {
      this.tags = this.tags.filter(t => t !== tag);
    }
  }
}