import axios from "axios";
import type { Customer } from "../types/Customer";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const API_URL = `${API_BASE_URL}/customers`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export type CustomerFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
};

export type CreateCustomerResponse = {
  message: string;
  customerId: number;
};

// Admin-only route
export const getCustomers = async (): Promise<Customer[]> => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

// Public route
export const createCustomer = async (
  customerData: CustomerFormData
): Promise<CreateCustomerResponse> => {
  const response = await axios.post(API_URL, customerData);
  return response.data;
};