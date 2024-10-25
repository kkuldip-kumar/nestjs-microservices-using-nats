import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductReview } from '../entities/product-review.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from 'src/common/exceptions/internal-server-error-exception';
import { lastValueFrom } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductReviewService {
  constructor(
    @InjectRepository(ProductReview)
    private reviewRepository: Repository<ProductReview>,
    @Inject('NATS_SERVICE') private natsClient: ClientProxy
  ) { }
  async findProductId(productId: string) {
    try {
      let product = await lastValueFrom(
        this.natsClient.send({ cmd: 'get-one-product' }, productId).pipe(
          retry(3),
          catchError((error) => {
            console.error('Microservice failed after retries:', error);
            throw new InternalServerErrorException('Microservice is unavailable');
          }),
        ),
      );
      return product;
    } catch (error) {
      console.error('Error from NATS microservice:', error);
      if (error && error.status === 'error') {
        throw new BadRequestException(error.message || ' Not found');
      }
      throw new InternalServerErrorException('Failed to communicate with microservice');
    }
  }
  async findUserById(userId: string) {
    try {
      let user = await lastValueFrom(
        this.natsClient.send({ cmd: 'getUserById' }, { userId }).pipe(
          retry(3),
          catchError((error) => {
            console.error('Microservice failed after retries:', error);
            throw new InternalServerErrorException('Microservice is unavailable');
          }),
        ),
      );
      return user;
    } catch (error) {
      console.error('Error from NATS microservice:', error);
      if (error && error.status === 'error') {
        throw new BadRequestException(error.message || ' Not found');
      }
      throw new InternalServerErrorException('Failed to communicate with microservice');
    }
  }
  async createReview(userId: string, createReviewDto: CreateProductReviewDto): Promise<ProductReview> {
    const { rating, review, productId } = createReviewDto;

    const user = await this.findUserById(userId);
    if (!user) {
      throw new Error('user not found');
    }
    const product = await this.findProductId(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const newReview = this.reviewRepository.create({
      rating,
      review,
      user: user,
      product,
    });

    return this.reviewRepository.save(newReview);
  }

  async getProductReviews(productId: string): Promise<ProductReview> {
    try {

      return this.reviewRepository.findOne({
        where: { product: { id: productId } },
        relations: ['user'],
      });
    } catch (error) {
      throw new Error(` ${error.message}`);
    }
  }

  // Update review
  async updateReview(reviewData: Partial<UpdateProductReviewDto>): Promise<string> {
    try {
      const review = await this.reviewRepository.findOne({ where: { id: reviewData.id } });
      if (!review) {
        throw new Error('Review not found');
      }
      Object.assign(review, reviewData);
      await this.reviewRepository.save(review);
      return 'updated successfully'
    } catch (error) {
      throw new Error(`Error updating review: ${error.message}`);
    }
  }

  // Find review by ID
  findOne(reviewId: string) {
    try {

      return this.reviewRepository.findOne({
        where: { product: { id: reviewId } },
        relations: ['user'],
      });
    } catch (error) {
      throw new Error('Error to find Review')
    }
  }


  // Find product by ID
  async removeReviewById(id: string): Promise<string> {
    try {

      console.log('review id at serice', id);
      const review = await this.reviewRepository.findOne({ where: { id: id } });

      console.log('review', review)
      if (!review) {
        throw new Error('review not found');
      }
      await this.reviewRepository.remove(review);
      return 'removed successfully'
    } catch (error) {
      throw new Error(error)
    }
  }


}
