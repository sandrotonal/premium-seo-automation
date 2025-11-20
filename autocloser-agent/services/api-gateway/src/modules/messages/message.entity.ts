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
import { Conversation } from './conversation.entity';
import { User } from '../users/user.entity';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  LOCATION = 'location',
  CONTACT = 'contact',
  TEMPLATE = 'template',
  QUICK_REPLY = 'quick_reply',
  BUTTON = 'button',
  INTERACTIVE = 'interactive',
}

export enum MessageDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

export enum MessageStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  REPLIED = 'replied',
}

export enum SenderType {
  CUSTOMER = 'customer',
  AI_AGENT = 'ai_agent',
  HUMAN_AGENT = 'human_agent',
  SYSTEM = 'system',
  BOT = 'bot',
}

@Entity('messages')
@Index(['conversationId', 'createdAt'])
@Index(['status', 'createdAt'])
@Index(['senderType', 'createdAt'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  conversationId: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  type: MessageType;

  @Column({
    type: 'enum',
    enum: MessageDirection,
  })
  direction: MessageDirection;

  @Column({
    type: 'enum',
    enum: SenderType,
  })
  senderType: SenderType;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.PENDING,
  })
  status: MessageStatus;

  @Column('text')
  content: string;

  @Column('json', { nullable: true })
  metadata: {
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    caption?: string;
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    contact?: {
      name: string;
      phone?: string;
      email?: string;
    };
    buttons?: Array<{
      id: string;
      title: string;
      payload?: string;
    }>;
    quickReplies?: Array<{
      id: string;
      title: string;
      payload?: string;
    }>;
    templateData?: Record<string, any>;
  };

  @Column({ nullable: true })
  externalId: string; // WhatsApp message ID, etc.

  @Column({ nullable: true })
  replyToMessageId: string; // For replies

  @Column({ nullable: true })
  mediaUrl: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  fileName: string;

  @Column({ nullable: true })
  mimeType: string;

  @Column({ type: 'bigint', nullable: true })
  fileSize: number;

  @Column('json', { nullable: true })
  aiMetadata: {
    confidence?: number;
    intent?: string;
    entities?: Array<{
      type: string;
      value: string;
      confidence: number;
    }>;
    sentiment?: {
      score: number;
      label: 'positive' | 'neutral' | 'negative';
    };
    language?: string;
    isSpam?: boolean;
    requiresHuman?: boolean;
  };

  @Column('json', { nullable: true })
  processingInfo: {
    processedAt?: Date;
    processingTime?: number;
    aiModel?: string;
    tokens?: number;
    errors?: string[];
  };

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  sentimentScore: number;

  @Column({ nullable: true })
  language: string;

  @Column({ default: false })
  isEdited: boolean;

  @Column({ nullable: true })
  editedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column('json', { nullable: true })
  deliveryInfo: {
    sentAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    failedAt?: Date;
    failureReason?: string;
    retryCount?: number;
    maxRetries?: number;
  };

  @Column('simple-array', { nullable: true })
  readBy: string[]; // Array of user IDs who read this message

  @Column({ nullable: true })
  scheduledAt: Date;

  @Column('json', { nullable: true })
  reactions: Array<{
    emoji: string;
    userId: string;
    createdAt: Date;
  }>;

  @Column('json', { nullable: true })
  customFields: Record<string, any>;

  @Column({ nullable: true })
  merchantId: string; // Denormalized for performance

  @Column({ nullable: true })
  userId: string; // If sent by a human agent

  // Relations
  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get isInbound(): boolean {
    return this.direction === MessageDirection.INBOUND;
  }

  get isOutbound(): boolean {
    return this.direction === MessageDirection.OUTBOUND;
  }

  get isCustomerMessage(): boolean {
    return this.senderType === SenderType.CUSTOMER;
  }

  get isAgentMessage(): boolean {
    return this.senderType === SenderType.AI_AGENT || this.senderType === SenderType.HUMAN_AGENT;
  }

  get isTextMessage(): boolean {
    return this.type === MessageType.TEXT;
  }

  get hasMedia(): boolean {
    return [MessageType.IMAGE, MessageType.VIDEO, MessageType.AUDIO, MessageType.DOCUMENT].includes(this.type);
  }

  get isInteractive(): boolean {
    return [MessageType.QUICK_REPLY, MessageType.BUTTON, MessageType.INTERACTIVE].includes(this.type);
  }

  get displayContent(): string {
    if (this.isDeleted) {
      return '[Message deleted]';
    }

    if (this.isEdited && this.deliveryInfo?.readAt) {
      return `${this.content} (edited)`;
    }

    return this.content;
  }

  markAsRead(userId: string): void {
    if (!this.readBy.includes(userId)) {
      this.readBy.push(userId);
    }

    this.status = MessageStatus.READ;
    this.deliveryInfo = {
      ...this.deliveryInfo,
      readAt: new Date(),
    };
  }

  markAsDelivered(): void {
    this.status = MessageStatus.DELIVERED;
    this.deliveryInfo = {
      ...this.deliveryInfo,
      deliveredAt: new Date(),
    };
  }

  markAsSent(): void {
    this.status = MessageStatus.SENT;
    this.deliveryInfo = {
      ...this.deliveryInfo,
      sentAt: new Date(),
    };
  }

  fail(reason: string): void {
    this.status = MessageStatus.FAILED;
    this.deliveryInfo = {
      ...this.deliveryInfo,
      failedAt: new Date(),
      failureReason: reason,
      retryCount: (this.deliveryInfo?.retryCount || 0) + 1,
    };
  }

  retry(): boolean {
    const maxRetries = this.deliveryInfo?.maxRetries || 3;
    const currentRetries = this.deliveryInfo?.retryCount || 0;

    if (currentRetries < maxRetries) {
      this.status = MessageStatus.PENDING;
      return true;
    }

    return false;
  }

  edit(newContent: string): void {
    this.content = newContent;
    this.isEdited = true;
    this.editedAt = new Date();
  }

  delete(): void {
    this.isDeleted = true;
    this.deletedAt = new Date();
  }

  addReaction(emoji: string, userId: string): void {
    if (!this.reactions) {
      this.reactions = [];
    }

    // Remove existing reaction from same user
    this.reactions = this.reactions.filter(r => r.userId !== userId);

    // Add new reaction
    this.reactions.push({
      emoji,
      userId,
      createdAt: new Date(),
    });
  }

  removeReaction(userId: string): void {
    if (this.reactions) {
      this.reactions = this.reactions.filter(r => r.userId !== userId);
    }
  }

  addReaction(emoji: string, userId: string): void {
    if (!this.reactions) {
      this.reactions = [];
    }

    // Remove existing reaction from same user
    this.reactions = this.reactions.filter(r => r.userId !== userId);

    // Add new reaction
    this.reactions.push({
      emoji,
      userId,
      createdAt: new Date(),
    });
  }

  scheduleFor(when: Date): void {
    this.scheduledAt = when;
    this.status = MessageStatus.PENDING;
  }

  updateAiMetadata(metadata: Partial<typeof this.aiMetadata>): void {
    this.aiMetadata = {
      ...this.aiMetadata,
      ...metadata,
    };
  }

  setProcessingInfo(info: {
    processingTime?: number;
    aiModel?: string;
    tokens?: number;
    errors?: string[];
  }): void {
    this.processingInfo = {
      processedAt: new Date(),
      ...info,
    };
  }

  getWordCount(): number {
    return this.content.split(/\s+/).filter(word => word.length > 0).length;
  }

  getCharacterCount(): number {
    return this.content.length;
  }

  getIsLongMessage(): boolean {
    return this.getWordCount() > 100 || this.getCharacterCount() > 1000;
  }
}