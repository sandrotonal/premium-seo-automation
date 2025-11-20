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
import { Merchant } from '../merchants/merchant.entity';

export enum WhatsAppProvider {
  TWILIO = 'twilio',
  META = 'meta',
}

export enum WhatsAppStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
  ERROR = 'error',
}

@Entity('whatsapp_configs')
@Index(['merchantId', 'status'])
export class WhatsAppConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  merchantId: string;

  @Column({
    type: 'enum',
    enum: WhatsAppProvider,
    default: WhatsAppProvider.TWILIO,
  })
  provider: WhatsAppProvider;

  @Column({
    type: 'enum',
    enum: WhatsAppStatus,
    default: WhatsAppStatus.PENDING_VERIFICATION,
  })
  status: WhatsAppStatus;

  @Column()
  phoneNumber: string;

  @Column({ unique: true })
  phoneNumberId: string; // External ID from provider

  @Column({ nullable: true })
  businessAccountId: string;

  @Column({ nullable: true })
  businessName: string;

  @Column({ nullable: true })
  displayName: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  profilePictureUrl: string;

  @Column({ nullable: true })
  websiteUrl: string;

  @Column('text', { nullable: true })
  address: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  vertical: string; // Business category

  @Column('json', { nullable: true })
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
      timezone: string;
    };
  };

  @Column('json', { nullable: true })
  providerCredentials: {
    accountSid?: string; // Twilio
    authToken?: string; // Twilio
    accessToken?: string; // Meta
    appSecret?: string; // Meta
    verifyToken?: string; // Meta
    webhookSecret?: string; // Meta
  };

  @Column({ nullable: true })
  webhookUrl: string;

  @Column('json', { nullable: true })
  webhookVerifyToken: string;

  @Column({ default: true })
  isDefault: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true })
  lastSyncAt: Date;

  @Column('json', { nullable: true })
  capabilities: {
    text: boolean;
    images: boolean;
    videos: boolean;
    audio: boolean;
    documents: boolean;
    templates: boolean;
    interactive: boolean;
  };

  @Column('json', { nullable: true })
  limits: {
    messagesPerSecond: number;
    messagesPerDay: number;
    templateMessagesPerDay: number;
  };

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  errorMessage: string;

  @Column('json', { nullable: true })
  lastError: {
    message: string;
    code?: string;
    details?: any;
    timestamp: Date;
  };

  // Relations
  @ManyToOne(() => Merchant, (merchant) => merchant.whatsappConfigs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'merchantId' })
  merchant: Merchant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get isActive(): boolean {
    return this.status === WhatsAppStatus.ACTIVE;
  }

  get canSendMessages(): boolean {
    return this.isActive && this.isVerified;
  }

  markAsError(error: string, code?: string, details?: any): void {
    this.status = WhatsAppStatus.ERROR;
    this.errorMessage = error;
    this.lastError = {
      message: error,
      code,
      details,
      timestamp: new Date(),
    };
  }

  markAsActive(): void {
    this.status = WhatsAppStatus.ACTIVE;
    this.errorMessage = null;
    this.lastError = null;
    this.lastSyncAt = new Date();
  }

  updateCredentials(credentials: Partial<typeof this.providerCredentials>): void {
    this.providerCredentials = {
      ...this.providerCredentials,
      ...credentials,
    };
    this.lastSyncAt = new Date();
  }

  syncBusinessInfo(businessInfo: any): void {
    this.businessName = businessInfo.name || this.businessName;
    this.displayName = businessInfo.display_name || this.displayName;
    this.description = businessInfo.description || this.description;
    this.profilePictureUrl = businessInfo.profile_picture_url || this.profilePictureUrl;
    this.websiteUrl = businessInfo.website || this.websiteUrl;
    this.address = businessInfo.address || this.address;
    this.email = businessInfo.email || this.email;
    this.vertical = businessInfo.vertical || this.vertical;
    
    this.lastSyncAt = new Date();
  }
}