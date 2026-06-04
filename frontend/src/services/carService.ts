import axios from "axios";
import type { Car } from "../types/Car";

const API_URL = "http://localhost:4000/api/cars";

export const getCars = async (): Promise<Car[]>=>{
    const response = await axios.get(API_URL);
    return response.data
}

export const getCarById = async (id: string): Promise<Car>=> {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
}