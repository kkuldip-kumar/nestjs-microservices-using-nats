import { Module } from '@nestjs/common';
import { ProductReviewService } from './product-review.service';
import { ProductReviewController } from './product-review.controller';
import { NatsClientModule } from '@/nats-client/nats-client.module';
@Module({
  imports: [NatsClientModule],
  controllers: [ProductReviewController],
  providers: [ProductReviewService],
})
export class ProductReviewModule { }
