import axios from "axios";
import type { Customer } from "../types/Customer";

const API_URL = "http://localhost:4000/api/customers";

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