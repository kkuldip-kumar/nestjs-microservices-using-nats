import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.natsClient.send({ cmd: 'add-product' }, createProductDto)
  }

  @Get()
  findAll() {
    return this.natsClient.send({ cmd: 'all-product' }, {})
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.natsClient.send({ cmd: 'all-product' }, id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.natsClient.send({ cmd: 'all-product' }, { id, updateProductDto })
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.natsClient.send({ cmd: 'all-product' }, id);
  }
}
