import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrderService) { }

  @MessagePattern({ cmd: 'create-order' })
  create(@Payload() createOrderDto: CreateOrderDto) {
    // const orderPayload = {
    //   userId,
    //   ...createOrderDto
    // }
    console.log('dsfs', createOrderDto)
    return this.ordersService.createOrder(createOrderDto);
  }

  // @MessagePattern({ cmd: 'find-all-orders' })
  // findAll() {
  //   return this.ordersService.findAll();
  // }

  // @MessagePattern({ cmd: 'all-orders-by-userId' })
  // findAllUsersOrder(@Payload userId: string) {
  //   return this.ordersService.getAllOrderByUser(userId);
  // }

  @MessagePattern({ cmd: 'find-one-order' })
  findOne(@Payload() id: string) {
    return this.ordersService.findOneOrder(id);
  }

  // @MessagePattern({ cmd: 'update-order' })
  // update(@Payload() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.updateOrderStatus(updateOrderDto);
  // }

  // @MessagePattern({ cmd: 'remove-order' })
  // remove(@Payload() id: string) {
  //   return this.ordersService.remove(id);
  // }
}
