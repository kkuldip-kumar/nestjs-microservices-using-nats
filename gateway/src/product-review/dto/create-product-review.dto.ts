import { IsString, IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateProductReviewDto {
    @IsUUID()
    @IsNotEmpty()
    productId: string;
    @IsNumber()
    @IsPositive()
    rating: number;
    @IsNotEmpty()
    @IsString()
    review: string;
}
