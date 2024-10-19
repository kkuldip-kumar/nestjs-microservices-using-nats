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
    try {
      let cart = await this.cartRepository.findOne({ where: { userId }, relations: ['items', 'items.product'] });
      if (!cart) {
        cart = this.cartRepository.create({ userId, items: [] });
        await this.cartRepository.save(cart);
      }
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

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<string> {
    try {
      const cart = await this.findOrCreateCart(userId);
      let product = await this.findProductId(addToCartDto.productId)
      if (!product) {
        throw new Error('Product not found');
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
          cart
        });
        cart.items.push(cartItem);
      }
      console.log('product', cart);
      await this.cartRepository.save(cart);
      return 'added successfully';

    } catch (error) {
      console.error('Error adding product to cart:', error.message);
      throw new Error('Could not add product to cart. Please try again.');
    }
  }

  async updateCartItem(updateCartItemDto: UpdateCartItemDto): Promise<Cart> {
    try {
      console.log('er', updateCartItemDto)
      const cart = await this.findOrCreateCart(updateCartItemDto.userId);
      const cartItem = cart.items.find(item => item.id === updateCartItemDto.cartItemId);
      if (!cartItem) {
        throw new Error('Cart item not found');
      }
      cartItem.quantity = updateCartItemDto.quantity;
      await this.cartItemRepository.update(cartItem.id, { quantity: updateCartItemDto.quantity });
      await this.cartRepository.save(cart);
      return cart;

    } catch (error) {
      console.error('Error updating cart item:', error.message);
      throw new Error('Could not update item in cart. Please try again.');
    }
  }


  async removeCartItem(removeCartItemDto: RemoveCartItemDto): Promise<Cart> {
    try {
      // Find or create the user's cart
      const cart = await this.findOrCreateCart(removeCartItemDto.userId);
      console.log('sf', removeCartItemDto);
      const cartItem = cart.items.find(item => item.id === removeCartItemDto.cartItemId);
      if (!cartItem) {
        throw new Error('Cart item not found');
      }
      cart.items = cart.items.filter(item => item.id !== removeCartItemDto.cartItemId);
      await this.cartItemRepository.delete(removeCartItemDto.cartItemId);
      await this.cartRepository.save(cart);
      return cart;

    } catch (error) {
      console.error('Error removing cart item:', error.message);
      throw new Error('Could not remove item from cart. Please try again.');
    }
  }


  async getCartByUser(userId: string): Promise<Cart> {
    try {
      // Find or create a cart for the given user
      const cart = await this.findOrCreateCart(userId);
      console.log(cart);
      if (!cart) {
        throw new Error('cart not found');
      }
      const populatedCart = await this.cartRepository.findOne({
        where: { id: cart.id },
        relations: ['items', 'items.product'],  // Assuming 'items' and 'items.product' are relationships in your model
      });

      if (!populatedCart) {
        throw new Error('Cart not found for the user');
      }

      // Return the cart with populated items
      return populatedCart;
    } catch (error) {
      // Throw an error if cart retrieval or creation fails
      throw new Error('Could not retrieve or create cart. Please try again.');
    }
  }
}
