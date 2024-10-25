import { Controller, Get, Post, Req, Body, Patch, Param, UseGuards, Delete } from '@nestjs/common';
import { ProductReviewService } from './product-review.service';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@/gaurds/auth.guard';
import { RequestModel } from '@/middleware/auth.middleware';
@Controller('product-review')
@UseGuards(AuthGuard)
export class ProductReviewController {
  constructor(
    private readonly productReviewService: ProductReviewService,
    @Inject('NATS_SERVICE') private natsClient: ClientProxy
  ) { }

  @Post()
  create(@Body() createProductReviewDto: CreateProductReviewDto, @Req() req: RequestModel) {
    const userId = req.user['sub'].userId;
    const reveiwData = { ...createProductReviewDto, userId: userId }
    console.log('gTW', reveiwData)
    return this.natsClient.send('add-review', reveiwData)
  }

  @Get()
  findAll() {
    return this.productReviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.natsClient.send('one-product-reviews', id)
    // return this.productReviewService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductReviewDto: UpdateProductReviewDto) {
    // return this.productReviewService.update(+id, updateProductReviewDto);
    return this.natsClient.send('update-product-review', updateProductReviewDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log('reviewId gateway', id)
    return this.natsClient.send('remove-product-review', id)
    // return this.productReviewService.remove(+id);
  }
}
