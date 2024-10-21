import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';


@Entity()
export class ProductReview {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'float', default: 0 })
    rating: number;

    @Column({ type: 'text' })
    review: string;

    @ManyToOne(() => User, user => user.reviews)
    user: User;

    @ManyToOne(() => Product, product => product.reviews)
    product: Product;

    @CreateDateColumn()
    createdAt: Date;
}
