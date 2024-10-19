export class CreateOrderDto {
    userId: string;
    shippingAddress: string;
    totalAmount: number;
    paymentMethod: string;
    items: [
        {
            productId: string,
            quantity: number
        }
    ]
}
