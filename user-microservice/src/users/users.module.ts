import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities/Payment';
import { User } from 'src/entities/User';
@Module({
  imports: [TypeOrmModule.forFeature([Payment, User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
