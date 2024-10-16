

import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('category')
export class CategoryController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }

  @Post()
  create(@Body() createProductDto: CreateCategoryDto) {
    return this.natsClient.send({ cmd: 'add-category' }, createProductDto)
  }

  @Get()
  findAll() {
    return this.natsClient.send({ cmd: 'all-category' },{})
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.natsClient.send({ cmd: 'get-category' }, id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateCategoryDto) {
    return this.natsClient.send({ cmd: 'update-category' }, { id, updateProductDto })
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.natsClient.send({ cmd: 'remove-category' }, id);
  }
}
