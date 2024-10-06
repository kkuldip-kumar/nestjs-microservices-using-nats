import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }

  @Post()
  createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    this.natsClient.emit('createPayment', createPaymentDto);
  }

  @Get()
  findAll() {
    // return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    // return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.paymentsService.remove(+id);
  }
}
