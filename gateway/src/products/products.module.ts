import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { NatsClientModule } from '@/nats-client/nats-client.module';

@Module({
  imports: [NatsClientModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
