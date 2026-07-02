import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderStatus {
  ORDER_PLACED = 'order_placed',
  ORDER_SUCCESSFUL = 'order_successful',
  IN_PREPARATION = 'in_preparation',
  ORDER_SHIPPED = 'order_shipped',
  IN_TRANSIT = 'in_transit',
  ORDER_DELIVERED = 'order_delivered',
  ORDER_CANCELLED = 'order_cancelled',
  AWAIT_RETURN = 'await_return',
  RETURNED = 'returned',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.ORDER_PLACED })
  status!: OrderStatus;

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