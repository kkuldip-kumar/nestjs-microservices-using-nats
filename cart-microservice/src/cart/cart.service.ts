import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cartItem.entity';
import { Product } from './entities/product.entity';
import { AddToCartDto, UpdateCartItemDto, RemoveCartItemDto } from './dto/create-cart.dto';
import { lastValueFrom } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepository: Repository<CartItem>,
    @Inject('NATS_SERVICE') private natsClient: ClientProxy
  ) { }

  async findOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({ where: { userId }, relations: ['items', 'items.product'] });
    if (!cart) {
      cart = this.cartRepository.create({ userId, items: [] });
      await this.cartRepository.save(cart);
    }
    return cart;
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<string> {
    const cart = await this.findOrCreateCart(userId);
    let product;
    try {
      product = await lastValueFrom(
        this.natsClient.send({ cmd: 'get-one-product' }, addToCartDto.productId).pipe(
          retry(3),
          catchError((error) => {
            console.error('Microservice failed after retries:', error);
            throw new InternalServerErrorException('Microservice is unavailable');
          }),
        ),
      );
    } catch (error) {
      console.error('Error from NATS microservice:', error);

      // Handle NATS error response here
      if (error && error.status === 'error') {
        throw new BadRequestException(error.message || ' Not found');
      }

      throw new InternalServerErrorException('Failed to communicate with microservice');
    }
    if (!cart.items) {
      cart.items = [];
    }
    let cartItem = cart.items.find(item => item.product === product.id);
    if (cartItem) {
      cartItem.quantity += addToCartDto.quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        product,
        quantity: addToCartDto.quantity,
      });
      cart.items.push(cartItem);
    }
    console.log('product', cart);
    await this.cartRepository.save(cart);
    return 'added successfully';
  }

  async updateCartItem(userId: string, updateCartItemDto: UpdateCartItemDto): Promise<Cart> {
    const cart = await this.findOrCreateCart(userId);
    const cartItem = cart.items.find(item => item.id === updateCartItemDto.cartItemId);
    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    cartItem.quantity = updateCartItemDto.quantity;
    await this.cartRepository.save(cart);
    return cart;
  }

  async removeCartItem(userId: string, removeCartItemDto: RemoveCartItemDto): Promise<Cart> {
    const cart = await this.findOrCreateCart(userId);
    cart.items = cart.items.filter(item => item.id !== removeCartItemDto.cartItemId);
    await this.cartRepository.save(cart);
    return cart;
  }

  async getCartByUser(userId: string): Promise<Cart> {
    return this.findOrCreateCart(userId);
  }
}
