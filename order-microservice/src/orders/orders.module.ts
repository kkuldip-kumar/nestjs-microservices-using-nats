import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrderService } from "./orders.service"
import { TypeOrmModule } from '@nestjs/typeorm';
import { NatsClientModule } from './nats-client/nats-client.module';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/orderItem.entity';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';
import { CartItem } from 'src/entities/cartItem.entity';
import { Cart } from 'src/entities/cart.entity';
@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Order, Product, CartItem, Category, Cart]), NatsClientModule],
  controllers: [OrdersController],
  providers: [OrderService],
})
export class OrdersModule { }
