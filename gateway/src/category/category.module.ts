import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { NatsClientModule } from '@/nats-client/nats-client.module';

@Module({
  imports: [NatsClientModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule { }
