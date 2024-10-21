import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { ProductReviewModule } from './product-review/product-review.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://nats']
        }
      }
    ]),
    AuthModule,
    UsersModule,
    PaymentsModule,
    ProductsModule,
    CategoryModule,
    CartModule,
    OrdersModule,
    ProductReviewModule
  ],
  controllers: [

  ],
  providers: [],
})
export class AppModule { }
