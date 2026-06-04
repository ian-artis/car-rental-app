import axios from "axios";
import type {
  Booking,
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

export const getBookings = async (): Promise<Booking[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const updateBookingStatus = async (id: number, status: string) => {
  const response = await axios.put(`${API_URL}/${id}/status`, { status });
  return response.data;
};

export const deleteBooking = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};