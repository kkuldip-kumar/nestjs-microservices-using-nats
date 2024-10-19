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
  update(@Payload() createCartDto: UpdateCartItemDto) {
    // const { id, createCartDto } = data
    console.log('createCartDto', createCartDto);
    return this.cartService.updateCartItem(createCartDto);
  }

  @MessagePattern('remove-item-from-cart')
  remove(@Payload() removeCartItemDto: RemoveCartItemDto) {
    // const { userId, removeCartItemDto } = data;
    console.log('data', removeCartItemDto)
    return this.cartService.removeCartItem(removeCartItemDto);
  }
}
