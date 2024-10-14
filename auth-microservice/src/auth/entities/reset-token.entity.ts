import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserLogin } from "./user-logIn.entity";

@Entity('reset-token')
export class ResetToken {
  @Column()
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ nullable: false })
  token: string;
  @ManyToOne(() => UserLogin, user => user.resetTokens, { onDelete: 'CASCADE' })
  user: UserLogin;

  @Column()
  expiryDate: Date;
}
