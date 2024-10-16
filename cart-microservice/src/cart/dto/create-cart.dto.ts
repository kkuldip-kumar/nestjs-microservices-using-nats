export class CreateCartDto { }

export class AddToCartDto {
    productId: string;
    quantity: number;
}

export class UpdateCartItemDto {
    cartItemId: string;
    quantity: number;
}

export class RemoveCartItemDto {
    cartItemId: string;
}
