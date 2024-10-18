import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './orderItem.entity';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { Cart } from '../cart/cart.entity';
import { InternalServerErrorException } from 'src/common/exceptions/internal-server-error-exception';
import { lastValueFrom } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>,
    private cartService: CartService,
    @Inject('NATS_SERVICE') private natsClient: ClientProxy
  ) { }


  async createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    // const cart: Cart = await this.cartService.getCartByUser(userId);
    let cart;
    try {
      cart = await lastValueFrom(
        this.natsClient.send('get-user-cart', userId).pipe(
          retry(3),
          catchError((error) => {
            console.error('Microservice failed after retries:', error);
            throw new InternalServerErrorException('Microservice is unavailable');
          }),
        ),
      );
    } catch (error) {

      // Handle NATS error response here
      if (error && error.status === 'error') {
        throw new BadRequestException(error.message || ' Not found');
      }

      throw new InternalServerErrorException('Failed to communicate with microservice');
    }
    if (cart.items.length === 0) {
      throw new Error('Cannot create order with an empty cart');
    }

    const order = this.orderRepository.create({
      userId,
      shippingAddress: createOrderDto.shippingAddress,
      totalAmount: cart.totalAmount,
      paymentMethod: createOrderDto.paymentMethod,
      status: 'pending',
    });

    order.items = cart.items.map((cartItem) =>
      this.orderItemRepository.create({
        product: 10,
        quantity: 1,
        ...order,
      }),
    );

    await this.orderRepository.save(order);
    cart.items = [];
    // await this.cartService.removeCart(userId);

    try {
      cart = await lastValueFrom(
        this.natsClient.send('remove-item-from-cart', userId).pipe(
          retry(3),
          catchError((error) => {
            console.error('Microservice failed after retries:', error);
            throw new InternalServerErrorException('Microservice is unavailable');
          }),
        ),
      );
    } catch (error) {

      // Handle NATS error response here
      if (error && error.status === 'error') {
        throw new BadRequestException(error.message || ' Not found');
      }

      throw new InternalServerErrorException('Failed to communicate with microservice');
    }
    return order;
  }


  async getOrderByUser(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.product'],
    });
  }
  async findOneOrder(id: string): Promise<Order> {
    return this.orderRepository.findOne({ where: { id } });
  }

  async updateOrderStatus(updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.orderRepository.findOne(updateOrderStatusDto.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = updateOrderStatusDto.status;
    await this.orderRepository.save(order);
    return order;
  }

}
