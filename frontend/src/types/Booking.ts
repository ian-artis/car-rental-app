export type Booking = {
  id: number;
  customer_id: number;
  car_id: number;

  pickup_date?: string;
  return_date?: string;

  pickup_datetime: string;
  return_datetime: string;

  delivery_option: "pickup" | "delivery";
  delivery_fee: number;

  total_price: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;

  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;

  brand?: string;
  model?: string;
  year?: number;
  daily_rate?: number;
};

export type CreateBookingRequest = {
  car_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  pickup_datetime: string;
  return_datetime: string;
  delivery_option: "pickup" | "delivery";
};

export type CreateBookingResponse = {
  message: string;
  bookingId: number;
  customerId: number;
  rentalDays: number;
  rentalPrice: number;
  deliveryFee: number;
  totalPrice: number;
  status: string;
  deliveryNotice: string | null;
};