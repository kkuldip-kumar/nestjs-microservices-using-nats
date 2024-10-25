import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { ProductReview } from './product-review.entity';
// import { Payment } from './Payment';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    username: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: true })
    displayName?: string;
    // This doesn't store reviewId, just declares a relationship
    @OneToMany(() => ProductReview, review => review.user)
    reviews: ProductReview[];
    // @OneToMany(() => Payment, (payment) => payment.user)
    // @JoinColumn()
    // payments: Payment[];
}