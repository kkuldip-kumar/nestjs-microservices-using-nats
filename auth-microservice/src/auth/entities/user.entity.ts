import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
} from 'typeorm';
import { UserLogin } from './user-logIn.entity';

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

    @OneToOne(() => UserLogin, userLogin => userLogin.user)
    userLogin: UserLogin;
}