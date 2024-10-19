export class CreateCartDto { }

export class AddToCartDto {
    productId: string;
    quantity: number;
}

export class UpdateCartItemDto {
    userId: string;
    cartItemId: string;
    quantity: number;
}

export class RemoveCartItemDto {
    userId: string;
    cartItemId: string;
}
