import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    shippingAddress: string;
    @IsNumber()
    totalAmount: number;
    @IsString()
    paymentMethod: string;
    @IsArray()
    items: {
        productId: string;
        quantity: number;
    }[];
}
