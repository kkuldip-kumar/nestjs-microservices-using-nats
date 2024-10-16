import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cartItem.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem, Cart, Product, Category]),
    NatsClientModule
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule { }
