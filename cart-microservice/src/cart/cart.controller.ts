import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartService } from './cart.service';
import { AddToCartDto, CreateCartDto, RemoveCartItemDto, UpdateCartItemDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @MessagePattern('add-to-cart')
  create(@Payload() data: { userId: string, createCartDto: AddToCartDto }) {
    console.log('data', data);
    const { userId, createCartDto } = data
    return this.cartService.addToCart(userId, createCartDto);
  }

  // @MessagePattern({cmd:'findAllCart'})
  // findAll() {
  //   return this.cartService.findAll();
  // }

  @MessagePattern('get-user-cart')
  findOne(@Payload() userId: string) {
    return this.cartService.getCartByUser(userId);
  }

  @MessagePattern('update-cart')
  update(@Payload() data: { id: string, createCartDto: UpdateCartItemDto }) {
    const { id, createCartDto } = data
    return this.cartService.updateCartItem(id, createCartDto);
  }

  @MessagePattern('remove-item-from-cart')
  remove(@Payload() data: { userId: string, removeCartItemDto: RemoveCartItemDto }) {
    const { userId, removeCartItemDto } = data
    console.log('data', userId, removeCartItemDto)
    return this.cartService.removeCartItem(userId, removeCartItemDto);
  }
}
