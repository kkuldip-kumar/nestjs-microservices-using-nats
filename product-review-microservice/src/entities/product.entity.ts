
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { ProductReview } from './product-review.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('int')
    quantity: number;

    @ManyToOne(() => Category, (category) => category.products, { eager: true })
    category: Category;
    @OneToMany(() => ProductReview, (review) => review.product)
    reviews: ProductReview

    // @OneToMany(() => CartItem, (cartItem) => cartItem.product)
    // cartItems: CartItem[];
    // @OneToMany(() => OrderItem, (cartItem) => cartItem.product)
    // orders: OrderItem[];
}
