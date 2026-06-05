import axios from "axios";
import type { Customer } from "../types/Customer";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const API_URL = `${API_BASE_URL}/customers`;

export type CustomerFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export type CreateCustomerResponse = {
  message: string;
  customerId: number;
};

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createCustomer = async (
  customerData: CustomerFormData
): Promise<CreateCustomerResponse> => {
  const response = await axios.post(API_URL, customerData);
  return response.data;
};