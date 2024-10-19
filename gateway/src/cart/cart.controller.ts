import { Controller, Get, Post, Body, Query, Patch, Param, Delete, Inject, UseGuards, Req } from '@nestjs/common';
import { AddToCartDto, RemoveCartItemDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@/gaurds/auth.guard';
import { RequestModel } from '@/middleware/auth.middleware';

@Controller('carts')
export class CartController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createCartDto: AddToCartDto, @Req() req: RequestModel) {
    const userId = req.user['sub'].id;
    return this.natsClient.send('add-to-cart', { userId, createCartDto })
  }

  @Get()
  @UseGuards(AuthGuard)
  findOne(@Req() req: RequestModel) {
    const userId = req.user['sub'].id;
    return this.natsClient.send('get-user-cart', userId)
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Req() req: RequestModel, @Body() updateCartDto: UpdateCartDto) {
    const userId = req.user['sub'].id;
    console.log('update', { userId, cartItemId: id, ...updateCartDto });
    return this.natsClient.send('update-cart', { userId, cartItemId: id, ...updateCartDto })
  }

  @Delete()
  @UseGuards(AuthGuard)
  removeItem(@Req() req: RequestModel, @Query() query: RemoveCartItemDto) {
    const userId = req.user['sub'].id;
    console.log('query', query);
    const { cartItemId: cartItemId } = query;
    console.log({ userId, cartItemId });
    return this.natsClient.send('remove-item-from-cart', { userId, cartItemId });
  }
}
