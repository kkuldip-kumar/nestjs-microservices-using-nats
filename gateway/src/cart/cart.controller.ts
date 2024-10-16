import { Controller, Get, Post, Body, Query, Patch, Param, Delete, Inject } from '@nestjs/common';
import { AddToCartDto, RemoveCartItemDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('carts')
export class CartController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }

  @Post()
  create(@Body() createCartDto: AddToCartDto) {
    // const userId = "d9dcf0ea-1b6c-459e-b26c-b13546603c8d"
    const userId = "5fae3e74-fa9c-4534-9eb5-973ab060709a"
    console.log('kk', { userId, createCartDto })
    return this.natsClient.send('add-to-cart', { userId, createCartDto })
  }

  @Get(':id')
  findOne(@Param('id') userId: string) {
    return this.natsClient.send('get-user-cart', userId)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.natsClient.send('update-cart', { id, updateCartDto })
  }

  @Delete(':id')
  removeItem(@Param('id') id: string, @Query() query: RemoveCartItemDto) {
    const { cartItemId: cartItemId } = query;
    console.log(id, cartItemId);
    return this.natsClient.send('remove-item-from-cart', { id, cartItemId });
  }
}
