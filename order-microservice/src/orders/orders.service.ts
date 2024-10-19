import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from 'src/entities/orderItem.entity';
import { InternalServerErrorException } from 'src/common/exceptions/internal-server-error-exception';
import { lastValueFrom } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ClientProxy } from '@nestjs/microservices';
import { Order } from 'src/entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>,
    @Inject('NATS_SERVICE') private natsClient: ClientProxy
  ) { }

  async emptyUsersCart(userId: string) {
    try {
      let cart = await lastValueFrom(
        this.natsClient.send('remove-item-from-cart', userId).pipe(
          retry(3),
          catchError((error) => {
            console.error('Microservice failed after retries:', error);
            throw new InternalServerErrorException('Microservice is unavailable');
          }),
        ),
      );
      return cart;
    } catch (error) {
      if (error && error.status === 'error') {
        throw new BadRequestException(error.message || ' Not found');
      }
      throw new InternalServerErrorException('Failed to communicate with microservice');
    }
  }

  async findProductId(productId: string) {
    try {
      let product = await lastValueFrom(
        this.natsClient.send({ cmd: 'get-one-product' }, productId).pipe(
          retry(3),
          catchError((error) => {
            console.error('Microservice failed after retries:', error);
            throw new InternalServerErrorException('Microservice is unavailable');
          }),
        ),
      );
      return product;
    } catch (error) {
      console.error('Error from NATS microservice:', error);
      if (error && error.status === 'error') {
        throw new BadRequestException(error.message || ' Not found');
      }
      throw new InternalServerErrorException('Failed to communicate with microservice');
    }
  }

  // async createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
  //   // const cart: Cart = await this.cartService.getCartByUser(userId);
  //   let cart;
  //   try {
  //     cart = await lastValueFrom(
  //       this.natsClient.send('get-user-cart', userId).pipe(
  //         retry(3),
  //         catchError((error) => {
  //           console.error('Microservice failed after retries:', error);
  //           throw new InternalServerErrorException('Microservice is unavailable');
  //         }),
  //       ),
  //     );
  //   } catch (error) {

  //     // Handle NATS error response here
  //     if (error && error.status === 'error') {
  //       throw new BadRequestException(error.message || ' Not found');
  //     }

  //     throw new InternalServerErrorException('Failed to communicate with microservice');
  //   }
  //   if (cart.items.length === 0) {
  //     throw new Error('Cannot create order with an empty cart');
  //   }

  //   const order = this.orderRepository.create({
  //     userId,
  //     shippingAddress: createOrderDto.shippingAddress,
  //     totalAmount: cart.totalAmount,
  //     paymentMethod: createOrderDto.paymentMethod,
  //     status: 'pending',
  //   });

  //   order.items = cart.items.map((cartItem) =>
  //     this.orderItemRepository.create({
  //       product: 10,
  //       quantity: 1,
  //       ...order,
  //     }),
  //   );

  //   await this.orderRepository.save(order);
  //   cart.items = [];
  //   // await this.cartService.removeCart(userId);


  //   return order;
  // }
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const orderItems = [];
    let totalAmount = 0;

    try {
      // Validate the products and quantities
      for (const item of createOrderDto.items) {
        const product = await this.findProductId(item.productId)
        if (!product) {
          throw new Error(`Product with id ${item.productId} not found`);
        }
        const orderItem = this.orderItemRepository.create({
          product,
          quantity: item.quantity,
        });

        totalAmount += orderItem.quantity * 10;
        orderItems.push(orderItem);
      }

      // Create the order
      const order = this.orderRepository.create({
        userId: createOrderDto.userId,
        shippingAddress: createOrderDto.shippingAddress,
        totalAmount,
        paymentMethod: createOrderDto.paymentMethod,
        items: orderItems,
      });

      // Save the order
      await this.orderRepository.save(order);

      // Process payment
      // await this.paymentService.processPayment(order);
      return order;
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while creating the order');
    }
  }


  async getAllOrderByUser(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.order'],
    });
  }
  async findOneOrder(id: string): Promise<Order> {
    return this.orderRepository.findOne({ where: { id } });
  }

  // async updateOrderStatus(updateOrderStatusDto: UpdateOrderDto): Promise<Order> {
  //   const order = await this.orderRepository.findOne(updateOrderStatusDto);
  //   if (!order) {
  //     throw new Error('Order not found');
  //   }

  //   order.status = updateOrderStatusDto.status;
  //   await this.orderRepository.save(order);
  //   return order;
  // }

}
