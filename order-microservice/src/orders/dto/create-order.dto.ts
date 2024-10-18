export class CreateOrderDto {
    cartId: string;
    shippingAddress: {
        street: string;
        city: string;
        country: string;
        postalCode: string;
    };
    paymentMethod: string;
}
