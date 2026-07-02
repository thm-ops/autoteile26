import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderState } from './domain/order-state';
import { PaymentState } from './domain/payment-state';

export { OrderState, PaymentState };

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: OrderState, default: OrderState.Created })
  orderState!: OrderState;

  @Column({ type: 'enum', enum: PaymentState, default: PaymentState.Created })
  paymentState!: PaymentState;

  @Column({ type: 'jsonb' })
  items!: object;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice!: string;

  @Column({ nullable: true })
  paypalOrderId!: string;

  @Column({ nullable: true })
  paypalCaptureId!: string;

  @Column({ nullable: true })
  comment!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}