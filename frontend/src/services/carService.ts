import axios from "axios";
import type { Car } from "../types/Car";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const API_URL = `${API_BASE_URL}/cars`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export type CarFormData = {
  brand: string;
  model: string;
  year: number;
  car_type: string;
  daily_rate: number;
  status: string;
  image_url: string;
};

// Public route
export const getCars = async (): Promise<Car[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Public route
export const getCarById = async (id: string): Promise<Car> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Admin-only route
export const createCar = async (carData: CarFormData) => {
  const response = await axios.post(API_URL, carData, getAuthHeaders());
  return response.data;
};

// Admin-only route
export const updateCar = async (id: number, carData: CarFormData) => {
  const response = await axios.put(`${API_URL}/${id}`, carData, getAuthHeaders());
  return response.data;
};

// Admin-only route
export const deleteCar = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};