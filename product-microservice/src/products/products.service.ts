import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }
  // Find all products
  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  // Search products with filters
  async searchProducts(
    name?: string,
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number
  ): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product');

    if (name) {
      query.andWhere('product.name ILIKE :name', { name: `%${name}%` });
    }

    if (categoryId) {
      query.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (minPrice) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    // Add any other filters if needed
    return await query.getMany();
  }

  async findProductsByCategoryId(categoryId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { category: { id: categoryId } }, // Use a nested condition
      relations: ['category'],
    });
  }

  // Find product by ID
  async findProductById(id: string): Promise<Product> {
    return this.productRepository.findOne({ where: { id } });
  }
  // Find product by ID
  async removeProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new Error('Product not found');
    }
    return this.productRepository.remove(product);
  }

  // Create a new product
  async createProduct(productData: Partial<CreateProductDto>): Promise<Product> {
    const category = await this.categoryRepository.findOne({
      where: { id: productData.category }, // Make sure category exists .id
    });
    if (!category) throw new Error('Category not found');

    const product = this.productRepository.create({ ...productData, category });
    return this.productRepository.save(product);
  }

  // Update product
  async updateProduct(id: string, productData: Partial<CreateProductDto>): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        throw new Error('Product not found');
      }
      Object.assign(product, productData);
      return await this.productRepository.save(product);
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }


}
