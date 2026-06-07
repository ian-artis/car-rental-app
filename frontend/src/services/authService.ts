import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const API_URL = `${API_BASE_URL}/auth`;

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  admin: {
    id: number;
    email: string;
    role: string;
  };
};

export const loginAdmin = async (
  loginData: LoginRequest
): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/login`, loginData);
  return response.data;
};

export const getAdminProfile = async () => {
  const token = localStorage.getItem("adminToken");

  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
};

export const isAdminLoggedIn = () => {
  return Boolean(localStorage.getItem("adminToken"));
};