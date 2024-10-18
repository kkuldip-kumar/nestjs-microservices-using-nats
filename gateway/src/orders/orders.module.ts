import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { NatsClientModule } from '@/nats-client/nats-client.module';

@Module({
  imports: [NatsClientModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
