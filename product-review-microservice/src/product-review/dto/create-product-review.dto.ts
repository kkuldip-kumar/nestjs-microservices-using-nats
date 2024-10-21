import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';
export class CreateProductReviewDto {
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    @IsNotEmpty()
    review: string;

    @IsString()
    @IsNotEmpty()
    productId: string; // Id of the product being reviewed
}

