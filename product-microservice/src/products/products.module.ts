import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql_db',
      port: 3306,
      username: 'testuser',
      password: 'testuser123',
      database: 'nestjs_db',
      entities: [Product, Category],
      synchronize: true,
    }),

  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
