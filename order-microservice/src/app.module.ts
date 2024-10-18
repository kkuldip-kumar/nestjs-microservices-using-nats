import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({

  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql_db',
      port: 3306,
      username: 'testuser',
      password: 'testuser123',
      database: 'nestjs_db',
      entities: [Order, OrderItem],
      synchronize: true,
    }),
    OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
