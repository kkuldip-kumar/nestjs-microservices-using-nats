import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateOrderDto {
    @IsUUID()
    @IsNotEmpty()
    userId: string;
    @IsUUID()
    @IsNotEmpty()
    shippingAddress: string;
    @IsNumber()
    @IsPositive()
    totalAmount: number;
    @IsNumber()
    @IsPositive()
    quantity: number;
    @IsUUID()
    status: string;
    @IsUUID()
    paymentMethod: string;
}
