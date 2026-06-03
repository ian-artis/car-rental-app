import { Request, Response } from "express";
import db from "../config/db";

/*
  Get all customers.

  This is useful for admin workflows where staff need to view
  customer records before creating or reviewing bookings.
*/
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM customers ORDER BY id DESC");

    res.json(rows);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
};

/*
  Get a single customer by ID.
*/
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customerId = Number(req.params.id);

    const [rows]: any = await db.query(
      "SELECT * FROM customers WHERE id = ?",
      [customerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Failed to fetch customer" });
  }
};

/*
  Create a customer record.

  Email is required because it uniquely identifies the customer
  and can later support login or booking confirmation features.
*/
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, phone } = req.body;

    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        message: "First name, last name, and email are required",
      });
    }

    const [result]: any = await db.query(
      `INSERT INTO customers (first_name, last_name, email, phone)
       VALUES (?, ?, ?, ?)`,
      [first_name, last_name, email, phone || null]
    );

    res.status(201).json({
      message: "Customer created successfully",
      customerId: result.insertId,
    });
  } catch (error: any) {
    console.error("Error creating customer:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "A customer with this email already exists",
      });
    }

    res.status(500).json({ message: "Failed to create customer" });
  }
};