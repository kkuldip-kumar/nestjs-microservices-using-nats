import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrderService } from "./orders.service"
import { TypeOrmModule } from '@nestjs/typeorm';
import { NatsClientModule } from './nats-client/nats-client.module';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/orderItem.entity';
@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Order]), NatsClientModule],
  controllers: [OrdersController],
  providers: [OrderService],
})
export class OrdersModule { }
