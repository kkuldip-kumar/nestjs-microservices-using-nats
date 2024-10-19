import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { NatsClientModule } from '@/nats-client/nats-client.module';
import { UserIdMiddleware } from '@/middleware/userId-middleware';

@Module({
  imports: [NatsClientModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
// implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(UserIdMiddleware)
//       .forRoutes(OrdersController);
//   }
// }
