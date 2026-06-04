import axios from "axios";
import type {
  CreateBookingRequest,
  CreateBookingResponse,
} from "../types/Booking";

const API_URL = "http://localhost:4000/api/bookings";

export const createBooking = async (
  bookingData: CreateBookingRequest
): Promise<CreateBookingResponse> => {
  const response = await axios.post(API_URL, bookingData);
  return response.data;
};