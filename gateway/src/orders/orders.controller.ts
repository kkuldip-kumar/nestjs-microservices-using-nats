import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Inject } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@/gaurds/auth.guard';
import { RequestModel } from '@/middleware/auth.middleware';
import { ClientProxy } from '@nestjs/microservices';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject('NATS_SERVICE') private natsClient: ClientProxy
  ) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: RequestModel,) {
    const userId = req.user['sub'].userId;
    const orderPayload = {
      userId,
      ...createOrderDto
    }
    return this.natsClient.send({ cmd: 'create-order' }, orderPayload);
    // return this.ordersService.create(orderPayload);
  }

  @Get()
  findAll(@Req() req: RequestModel,) {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestModel,) {
    return this.ordersService.findOne(+id);
  }

  @Get('user-orders')
  findAllUserOrder(@Param('id') id: string, @Req() req: RequestModel,) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: RequestModel, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestModel,) {
    return this.ordersService.remove(+id);
  }
}
