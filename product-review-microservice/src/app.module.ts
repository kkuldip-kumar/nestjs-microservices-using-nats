import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductReviewModule } from './product-review/product-review.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductReview } from './product-review/entities/product-review.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql_db',
      port: 3306,
      username: 'testuser',
      password: 'testuser123',
      database: 'nestjs_db',
      entities: [Product, ProductReview],
      synchronize: true,
    }), ProductReviewModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
