

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity('order_item')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Product, (product) => product.orders, { eager: true })
    product: Product;

    @Column('int')
    quantity: number;

    @ManyToOne(() => Order, (order) => order.items)
    order: Order;
}
