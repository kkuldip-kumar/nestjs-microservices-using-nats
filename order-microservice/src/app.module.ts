import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { CartItem } from './entities/cartItem.entity';
import { Cart } from './entities/cart.entity';
@Module({

  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql_db',
      port: 3306,
      username: 'testuser',
      password: 'testuser123',
      database: 'nestjs_db',
      entities: [Order, OrderItem, Product, Category, CartItem, Cart],
      synchronize: true,
    }),
    OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
