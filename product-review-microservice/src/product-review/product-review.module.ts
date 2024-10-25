import { Module } from '@nestjs/common';
import { ProductReviewService } from './product-review.service';
import { ProductReviewController } from './product-review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { Product } from 'src/entities/product.entity';
import { ProductReview } from 'src/entities/product-review.entity';
import { User } from 'src/entities/user.entity';
import { Category } from 'src/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductReview, User, Category]), NatsClientModule],
  controllers: [ProductReviewController],
  providers: [ProductReviewService],
})
export class ProductReviewModule { }
