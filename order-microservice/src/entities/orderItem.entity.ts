

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './Cart';
import { Product } from './Product';

@Entity('orderItem')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Product, { eager: true })
    product: Product;

    @Column('int')
    quantity: number;

    @ManyToOne(() => Cart, (cart) => cart.items)
    cart: Cart;
}
