import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @MessagePattern('createCategory')
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @MessagePattern('findAllCategories')
  findAll() {
    return this.categoriesService.findAll();
  }

  @MessagePattern('findOneCategory')
  findOne(@Payload() id: string) {
    return this.categoriesService.findOne(id);
  }

  @MessagePattern('updateCategory')
  update(@Payload() id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @MessagePattern('removeCategory')
  remove(@Payload() id: string) {
    return this.categoriesService.remove(id);
  }
}
