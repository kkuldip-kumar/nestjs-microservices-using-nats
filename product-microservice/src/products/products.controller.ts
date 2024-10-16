import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @MessagePattern({cmd:'add-product'})
  createProduct(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @MessagePattern({cmd:'all-product'})
  findAll() {
    return this.productsService.findAll();
  }

  @MessagePattern({cmd:"get-one-product"})
  findOne(@Payload() id: string) {
    return this.productsService.findProductById(id);
  }
  // @MessagePattern('findOneProduct')
  // searchProducts(
  //   @Query('name') name?: string,
  //   @Query('categoryId') categoryId?: string,
  //   @Query('minPrice') minPrice?: number,
  //   @Query('maxPrice') maxPrice?: number,
  // ): Promise<Product[]> {
  //   return this.productsService.searchProducts(name, categoryId, minPrice, maxPrice);
  // }

  @MessagePattern({ cmd: 'update-product' })
  update(@Payload() data: { id: string; updateProductDto: UpdateProductDto }) {
    const { id, updateProductDto } = data;
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @MessagePattern({cmd:'remove-product'})
  remove(@Payload() id: string) {
    return this.productsService.removeProductById(id);
  }
}
