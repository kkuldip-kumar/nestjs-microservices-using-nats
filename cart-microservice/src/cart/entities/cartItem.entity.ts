

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';

@Entity('cart_items')
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Product, (product) => product.cartItems, { eager: true })
    product: Product;

    @Column('int')
    quantity: number;

    @ManyToOne(() => Cart, (cart) => cart.items)
    cart: Cart;
}
