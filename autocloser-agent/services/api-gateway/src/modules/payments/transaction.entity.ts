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
import { Conversation } from '../conversations/conversation.entity';
import { Merchant } from '../merchants/merchant.entity';

export enum TransactionType {
  SUBSCRIPTION = 'subscription',
  ONE_TIME = 'one_time',
  REFUND = 'refund',
  CHARGEBACK = 'chargeback',
  ADJUSTMENT = 'adjustment',
}

export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  DISPUTED = 'disputed',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  DIGITAL_WALLET = 'digital_wallet',
  MOBILE_PAYMENT = 'mobile_payment',
  CRYPTO = 'crypto',
  CASH = 'cash',
}

@Entity('transactions')
@Index(['merchantId', 'status'])
@Index(['userId', 'status'])
@Index(['conversationId'])
@Index(['createdAt'])
@Index(['paymentProviderId'], { unique: true })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  transactionReference: string;

  @Column()
  merchantId: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  conversationId: string; // If related to a specific conversation

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.ONE_TIME,
  })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CREDIT_CARD,
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  feeAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ default: 'TRY' })
  currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  refundedAmount: number;

  @Column({ nullable: true })
  description: string;

  @Column('text', { nullable: true })
  products: string; // JSON string of product details

  @Column('json', { nullable: true })
  lineItems: Array<{
    id: string;
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    tax?: number;
    metadata?: Record<string, any>;
  }>;

  @Column({ nullable: true })
  customerEmail: string;

  @Column({ nullable: true })
  customerName: string;

  @Column('json', { nullable: true })
  customerInfo: {
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    taxId?: string;
  };

  @Column({ nullable: true })
  paymentProviderId: string; // External transaction ID

  @Column({ nullable: true })
  paymentProvider: string; // 'iyzico', 'stripe', 'payu', etc.

  @Column({ nullable: true })
  paymentProviderTransactionId: string;

  @Column({ nullable: true })
  checkoutUrl: string;

  @Column({ nullable: true })
  returnUrl: string;

  @Column({ nullable: true })
  cancelUrl: string;

  @Column('json', { nullable: true })
  paymentDetails: {
    cardLast4?: string;
    cardBrand?: string;
    installments?: number;
    installmentAmount?: number;
    bin?: string;
    issuer?: string;
    receiver?: string;
    locale?: string;
    paymentGroup?: string;
  };

  @Column('json', { nullable: true })
  webhookData: Record<string, any>; // Raw webhook payload

  @Column({ nullable: true })
  invoiceNumber: string;

  @Column({ nullable: true })
  invoiceUrl: string;

  @Column({ nullable: true })
  receiptNumber: string;

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  processedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  failedAt: Date;

  @Column({ nullable: true })
  refundedAt: Date;

  @Column({ nullable: true })
  expiresAt: Date; // For checkout links

  @Column({ nullable: true })
  failureReason: string;

  @Column({ nullable: true })
  failureCode: string;

  @Column({ nullable: true })
  errorDetails: string;

  @Column('json', { nullable: true })
  ipAddress: string;

  @Column('json', { nullable: true })
  userAgent: string;

  @Column('json', { nullable: true })
  riskInfo: {
    score?: number;
    level?: 'low' | 'medium' | 'high';
    factors?: string[];
  };

  @Column('json', { nullable: true })
  fulfillment: {
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'failed';
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
    notes?: string;
  };

  @Column({ nullable: true })
  notes: string;

  // Relations
  @ManyToOne(() => Merchant, { eager: true })
  @JoinColumn({ name: 'merchantId' })
  merchant: Merchant;

  @ManyToOne(() => User, (user) => user.transactions, {
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.transactions, {
    nullable: true,
  })
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get isPending(): boolean {
    return this.status === TransactionStatus.PENDING;
  }

  get isProcessing(): boolean {
    return this.status === TransactionStatus.PROCESSING;
  }

  get isCompleted(): boolean {
    return this.status === TransactionStatus.COMPLETED;
  }

  get isFailed(): boolean {
    return this.status === TransactionStatus.FAILED;
  }

  get isCancelled(): boolean {
    return this.status === TransactionStatus.CANCELLED;
  }

  get isRefunded(): boolean {
    return [TransactionStatus.REFUNDED, TransactionStatus.PARTIALLY_REFUNDED].includes(this.status);
  }

  get isDisputed(): boolean {
    return this.status === TransactionStatus.DISPUTED;
  }

  get netAmount(): number {
    return this.totalAmount - this.feeAmount;
  }

  get isExpired(): boolean {
    return this.expiresAt && new Date() > this.expiresAt;
  }

  get canBeRefunded(): boolean {
    return this.isCompleted && !this.isRefunded;
  }

  get refundAmount(): number {
    return this.refundedAmount || 0;
  }

  get canRefundMore(): boolean {
    return this.canBeRefunded && this.refundAmount < this.totalAmount;
  }

  get maxRefundAmount(): number {
    return this.totalAmount - this.refundAmount;
  }

  markAsProcessing(): void {
    this.status = TransactionStatus.PROCESSING;
  }

  markAsCompleted(): void {
    this.status = TransactionStatus.COMPLETED;
    this.completedAt = new Date();
    this.processedAt = new Date();
  }

  markAsFailed(reason: string, code?: string, details?: string): void {
    this.status = TransactionStatus.FAILED;
    this.failedAt = new Date();
    this.failureReason = reason;
    this.failureCode = code;
    this.errorDetails = details;
  }

  cancel(reason?: string): void {
    this.status = TransactionStatus.CANCELLED;
    this.failureReason = reason;
  }

  refund(amount: number, reason?: string): void {
    this.refundedAmount = (this.refundedAmount || 0) + amount;
    
    if (this.refundedAmount >= this.totalAmount) {
      this.status = TransactionStatus.REFUNDED;
    } else {
      this.status = TransactionStatus.PARTIALLY_REFUNDED;
    }
    
    this.refundedAt = new Date();
    
    if (!this.metadata) {
      this.metadata = {};
    }
    
    if (!this.metadata.refunds) {
      this.metadata.refunds = [];
    }
    
    this.metadata.refunds.push({
      amount,
      reason,
      refundedAt: new Date(),
    });
  }

  updateFromWebhook(webhookData: any): void {
    this.webhookData = webhookData;
    
    // Update status based on webhook
    const status = webhookData.status || webhookData.paymentStatus;
    
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'paid':
        if (this.status !== TransactionStatus.COMPLETED) {
          this.markAsCompleted();
        }
        break;
        
      case 'failure':
      case 'failed':
      case 'error':
        this.markAsFailed(
          webhookData.failureReason || 'Payment failed',
          webhookData.errorCode,
          webhookData.errorMessage
        );
        break;
        
      case 'cancelled':
        this.cancel('Cancelled by user');
        break;
        
      case 'refunded':
      case 'refund':
        this.refund(
          webhookData.refundedAmount || this.totalAmount,
          webhookData.refundReason
        );
        break;
    }
    
    // Update payment details
    if (webhookData.paymentDetails) {
      this.paymentDetails = {
        ...this.paymentDetails,
        ...webhookData.paymentDetails,
      };
    }
  }

  setCheckoutUrl(url: string): void {
    this.checkoutUrl = url;
  }

  setExpiration(minutes: number = 30): void {
    this.expiresAt = new Date(Date.now() + minutes * 60 * 1000);
  }

  addLineItem(item: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    description?: string;
    tax?: number;
    metadata?: Record<string, any>;
  }): void {
    if (!this.lineItems) {
      this.lineItems = [];
    }
    
    item.totalPrice = item.quantity * item.unitPrice + (item.tax || 0);
    this.lineItems.push(item);
    
    // Recalculate totals
    this.recalculateTotals();
  }

  private recalculateTotals(): void {
    if (!this.lineItems || this.lineItems.length === 0) {
      return;
    }
    
    const subtotal = this.lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalTax = this.lineItems.reduce((sum, item) => sum + (item.tax || 0), 0);
    
    this.amount = subtotal - totalTax;
    this.taxAmount = totalTax;
    this.totalAmount = subtotal;
  }

  generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    this.invoiceNumber = `INV-${year}${month}-${sequence}`;
    return this.invoiceNumber;
  }

  generateReceiptNumber(): string {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-8);
    const sequence = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    
    this.receiptNumber = `REC-${timestamp}-${sequence}`;
    return this.receiptNumber;
  }

  setFulfillmentStatus(status: typeof this.fulfillment.status, notes?: string): void {
    if (!this.fulfillment) {
      this.fulfillment = { status };
    } else {
      this.fulfillment.status = status;
    }
    
    if (notes) {
      this.fulfillment.notes = notes;
    }
    
    if (status === 'delivered') {
      this.fulfillment.actualDelivery = new Date();
    }
  }
}