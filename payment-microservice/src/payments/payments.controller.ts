import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller()
export class PaymentsController {
  constructor(
    @Inject('NATS_SERVICE') private natsClient: ClientProxy,
    private readonly paymentsService: PaymentsService
  ) { }
  @EventPattern('createPayment')
  async createPayment(@Payload() createPaymentDto: CreatePaymentDto) {
    console.log(createPaymentDto);
    const newPayment =
      await this.paymentsService.createPayment(createPaymentDto);
    if (newPayment) this.natsClient.emit('paymentCreated', newPayment);
  }

  // @MessagePattern('findAllPayments')
  // findAll() {
  //   return this.paymentsService.findAll();
  // }

  // @MessagePattern('findOnePayment')
  // findOne(@Payload() id: number) {
  //   return this.paymentsService.findOne(id);
  // }

  // @MessagePattern('updatePayment')
  // update(@Payload() updatePaymentDto: UpdatePaymentDto) {
  //   return this.paymentsService.update(updatePaymentDto.id, updatePaymentDto);
  // }

  // @MessagePattern('removePayment')
  // remove(@Payload() id: number) {
  //   return this.paymentsService.remove(id);
  // }
}
