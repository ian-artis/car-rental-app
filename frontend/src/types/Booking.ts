export type CreateBookingRequest = {
    customer_id: number;
    car_id: number;
    pickup_date: string;
    return_date: string;
};

export type CreateBookingResponse = {
    message: string;
    bookingId: number;
    rentalDays: number;
    totalPrice: number;
};