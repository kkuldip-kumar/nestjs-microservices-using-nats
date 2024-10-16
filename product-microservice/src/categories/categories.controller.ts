import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @MessagePattern({cmd:"add-category"})
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @MessagePattern({cmd:'all-category'})
  findAll() {
    return this.categoriesService.findAll();
  }

  @MessagePattern({cmd:'get-category'})
  findOne(@Payload() id: string) {
    return this.categoriesService.findOne(id);
  }

  @MessagePattern({cmd:'update-category'})
  update(@Payload() data:{id: string, updateCategoryDto: UpdateCategoryDto}) {
    const { id, updateCategoryDto } = data;
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @MessagePattern({cmd:'remove-category'})
  remove(@Payload() id: string) {
    return this.categoriesService.remove(id);
  }
}
