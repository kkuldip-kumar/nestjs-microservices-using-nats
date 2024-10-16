import { IsString, IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateCartDto {
}
export class AddToCartDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class UpdateCartItemDto {
  @IsUUID()
  @IsNotEmpty()
  cartItemId: string;
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class RemoveCartItemDto {
  @IsUUID()
  @IsNotEmpty()
  cartItemId: string;
}

