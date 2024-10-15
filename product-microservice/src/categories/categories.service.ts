import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }
  create(createCategoryDto: CreateCategoryDto) {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }



  findAll() {
    return this.categoryRepository.find();
  }

  findOne(id: string) {
    return this.categoryRepository.findOne({ where: { id } });
  }


  async update(id: string, updateCategoryDto: Partial<CreateCategoryDto>): Promise<CreateCategoryDto> {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        throw new Error('Product not found');
      }
      Object.assign(category, updateCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  remove(id: string) {
    return this.categoryRepository.findOne({ where: { id } });
  }
}
