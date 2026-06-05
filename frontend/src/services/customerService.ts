import axios from "axios";
import type { Customer } from "../types/Customer";

const API_URL = "http://localhost:4000/api/customers";

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};