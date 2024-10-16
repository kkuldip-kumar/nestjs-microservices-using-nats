import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart/entities/cart.entity';
import { CartItem } from './cart/entities/cartItem.entity';
import { Product } from './cart/entities/product.entity';
import { Category } from './cart/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql_db',
      port: 3306,
      username: 'testuser',
      password: 'testuser123',
      database: 'nestjs_db',
      entities: [Cart, CartItem, Product, Category],
      synchronize: true,
    }),
    CartModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
