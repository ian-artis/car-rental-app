import { Request, Response } from "express";
import db from "../config/db";

export const getCars = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM cars ORDER BY id DESC");

    res.json(rows);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ message: "Failed to fetch cars" });
  }
};

export const getCarById = async (req: Request, res: Response) => {
  try {
    const carId = Number(req.params.id);

    const [rows]: any = await db.query("SELECT * FROM cars WHERE id = ?", [
      carId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching car:", error);
    res.status(500).json({ message: "Failed to fetch car" });
  }
};

export const createCar = async (req: Request, res: Response) => {
  try {
    const {
      brand,
      model,
      year,
      car_type,
      daily_rate,
      status,
      image_url,
    } = req.body;

    if (!brand || !model || !year || !car_type || !daily_rate) {
      return res.status(400).json({
        message: "Brand, model, year, car type, and daily rate are required",
      });
    }

    const [result]: any = await db.query(
      `INSERT INTO cars 
      (brand, model, year, car_type, daily_rate, status, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        brand,
        model,
        year,
        car_type,
        daily_rate,
        status || "available",
        image_url || null,
      ]
    );

    res.status(201).json({
      message: "Car created successfully",
      carId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({ message: "Failed to create car" });
  }
};

export const updateCar = async (req: Request, res: Response) => {
  try {
    const carId = Number(req.params.id);

    const {
      brand,
      model,
      year,
      car_type,
      daily_rate,
      status,
      image_url,
    } = req.body;

    const [result]: any = await db.query(
      `UPDATE cars
       SET brand = ?, 
           model = ?, 
           year = ?, 
           car_type = ?, 
           daily_rate = ?, 
           status = ?, 
           image_url = ?
       WHERE id = ?`,
      [
        brand,
        model,
        year,
        car_type,
        daily_rate,
        status,
        image_url,
        carId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json({ message: "Car updated successfully" });
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ message: "Failed to update car" });
  }
};

export const deleteCar = async (req: Request, res: Response) => {
  try {
    const carId = Number(req.params.id);

    const [result]: any = await db.query("DELETE FROM cars WHERE id = ?", [
      carId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ message: "Failed to delete car" });
  }
};