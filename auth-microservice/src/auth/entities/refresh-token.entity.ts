import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserLogin } from "./user-logIn.entity";

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @ManyToOne(() => UserLogin, user => user.refreshTokens, { onDelete: 'CASCADE' })
  user: UserLogin;

  @Column()
  expiryDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
