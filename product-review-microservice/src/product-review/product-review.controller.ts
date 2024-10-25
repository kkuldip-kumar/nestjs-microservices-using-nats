import { Controller, Req } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductReviewService } from './product-review.service';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';

@Controller('product-review')
export class ProductReviewController {
  constructor(private readonly productReviewService: ProductReviewService) { }

  @MessagePattern('add-review')
  create(@Payload() createProductReviewDto: CreateProductReviewDto,) {
    console.log('service', createProductReviewDto);
    return this.productReviewService.createReview(createProductReviewDto.userId, createProductReviewDto);
  }

  @MessagePattern('one-product-reviews')
  findAll(@Payload() productId: string) {
    return this.productReviewService.getProductReviews(productId);
  }

  @MessagePattern('findOneProductReview')
  findOne(@Payload() id: string) {
    return this.productReviewService.findOne(id);
  }

  @MessagePattern('update-product-review')
  update(@Payload() updateProductReviewDto: UpdateProductReviewDto) {
    return this.productReviewService.updateReview(updateProductReviewDto);
  }

  @MessagePattern('remove-product-review')
  remove(@Payload() id: string) {
    console.log('serice controller', id)

    return this.productReviewService.removeReviewById(id);
  }
}
