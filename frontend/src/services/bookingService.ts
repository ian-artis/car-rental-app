import axios from "axios";
import type {
  Booking,
  CreateBookingRequest,
  CreateBookingResponse,
} from "../types/Booking";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const API_URL = `${API_BASE_URL}/bookings`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Public route: customers can create booking requests without login
export const createBooking = async (
  bookingData: CreateBookingRequest
): Promise<CreateBookingResponse> => {
  const response = await axios.post(API_URL, bookingData);
  return response.data;
};

// Admin-only route: requires token
export const getBookings = async (): Promise<Booking[]> => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

// Admin-only route: requires token
export const updateBookingStatus = async (id: number, status: string) => {
  const response = await axios.put(
    `${API_URL}/${id}/status`,
    { status },
    getAuthHeaders()
  );

  return response.data;
};

// Admin-only route: requires token
export const deleteBooking = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};