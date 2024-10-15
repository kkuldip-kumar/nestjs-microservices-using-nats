import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './category.entity';

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
}
