import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductReviewService } from './product-review.service';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';

@Controller()
export class ProductReviewController {
  constructor(private readonly productReviewService: ProductReviewService) {}

  @MessagePattern('createProductReview')
  create(@Payload() createProductReviewDto: CreateProductReviewDto) {
    return this.productReviewService.create(createProductReviewDto);
  }

  @MessagePattern('findAllProductReview')
  findAll() {
    return this.productReviewService.findAll();
  }

  @MessagePattern('findOneProductReview')
  findOne(@Payload() id: number) {
    return this.productReviewService.findOne(id);
  }

  @MessagePattern('updateProductReview')
  update(@Payload() updateProductReviewDto: UpdateProductReviewDto) {
    return this.productReviewService.update(updateProductReviewDto.id, updateProductReviewDto);
  }

  @MessagePattern('removeProductReview')
  remove(@Payload() id: number) {
    return this.productReviewService.remove(id);
  }
}
