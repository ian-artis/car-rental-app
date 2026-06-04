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

export type Booking = {
  id: number;
  customer_id: number;
  car_id: number;
  pickup_date: string;
  return_date: string;
  total_price: string;
  status: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  brand: string;
  model: string;
  year: number;
};