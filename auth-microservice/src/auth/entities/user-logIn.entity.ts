import { ResetToken } from './reset-token.entity';
import { RefreshToken } from './refresh-token.entity';
// import { Exclude } from 'class-transformer';
import { User } from "./user.entity";

import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('userLogin')
export class UserLogin {
    @Column()
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    name: string;
    @Column()
    email: string;
    @Column()
    // @Exclude()
    password: string;
    @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;
    @CreateDateColumn()
    createdAt: Date
    @UpdateDateColumn()
    updatedAt: Date
    @OneToMany(() => ResetToken, resetToken => resetToken.user)
    resetTokens: ResetToken[];
    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
    refreshTokens: RefreshToken[];
}
