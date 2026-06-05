import { Request, Response } from "express";
import db from "../config/db";

/*
  Calculate the number of rental days between pickup and return dates.

  The return date must be after the pickup date. This value is used
  to calculate the final rental total on the backend.
*/
const calculateRentalDays = (pickupDate: string, returnDate: string) => {
  const pickup = new Date(pickupDate);
  const returned = new Date(returnDate);

  const differenceMs = returned.getTime() - pickup.getTime();
  const days = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

  return days;
};

/*
  Get all bookings with related customer and car information.

  JOINs are used so the API response can show readable booking details
  instead of only foreign key IDs.
*/
export const getBookings = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        bookings.id,
        bookings.customer_id,
        bookings.car_id,
        bookings.pickup_date,
        bookings.return_date,
        bookings.total_price,
        bookings.status,
        bookings.created_at,
        customers.first_name,
        customers.last_name,
        customers.email,
        cars.brand,
        cars.model,
        cars.year
      FROM bookings
      JOIN customers ON bookings.customer_id = customers.id
      JOIN cars ON bookings.car_id = cars.id
      ORDER BY bookings.id DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

/*
  Get one booking by ID with customer and car details.
*/
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.id);

    const [rows]: any = await db.query(
      `
      SELECT 
        bookings.id,
        bookings.customer_id,
        bookings.car_id,
        bookings.pickup_date,
        bookings.return_date,
        bookings.total_price,
        bookings.status,
        bookings.created_at,
        customers.first_name,
        customers.last_name,
        customers.email,
        cars.brand,
        cars.model,
        cars.year
      FROM bookings
      JOIN customers ON bookings.customer_id = customers.id
      JOIN cars ON bookings.car_id = cars.id
      WHERE bookings.id = ?
      `,
      [bookingId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Failed to fetch booking" });
  }
};

/*
  Create a new booking.

  This endpoint validates the customer, car, rental dates, calculates the
  total price, and prevents overlapping bookings for the same car.
*/
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, car_id, pickup_date, return_date } = req.body;

    if (!customer_id || !car_id || !pickup_date || !return_date) {
      return res.status(400).json({
        message: "Customer ID, car ID, pickup date, and return date are required",
      });
    }

    const rentalDays = calculateRentalDays(pickup_date, return_date);

    if (rentalDays <= 0) {
      return res.status(400).json({
        message: "Return date must be after pickup date",
      });
    }

    /*
      Confirm the customer exists before creating a booking that depends
      on the customers table.
    */
    const [customerRows]: any = await db.query(
      "SELECT id FROM customers WHERE id = ?",
      [customer_id]
    );

    if (customerRows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    /*
      Get the car rate from the database so pricing cannot be manipulated
      by changing the request body from the client.
    */
    const [carRows]: any = await db.query("SELECT * FROM cars WHERE id = ?", [
      car_id,
    ]);

    if (carRows.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }

    const car = carRows[0];

    /*
      Prevent double-booking.

      Two date ranges overlap when an existing pickup date is before the
      new return date, and the existing return date is after the new pickup date.
    */
    const [overlapRows]: any = await db.query(
      `
      SELECT id FROM bookings
      WHERE car_id = ?
      AND status IN ('pending', 'confirmed')
      AND pickup_date < ?
      AND return_date > ?
      `,
      [car_id, return_date, pickup_date]
    );

    if (overlapRows.length > 0) {
      return res.status(409).json({
        message: "Car is already booked for the selected dates",
      });
    }

    const totalPrice = rentalDays * Number(car.daily_rate);

    const [result]: any = await db.query(
      `
      INSERT INTO bookings
      (customer_id, car_id, pickup_date, return_date, total_price, status)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [customer_id, car_id, pickup_date, return_date, totalPrice, "pending"]
    );

    res.status(201).json({
      message: "Booking created successfully",
      bookingId: result.insertId,
      rentalDays,
      totalPrice,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

/*
  Update the booking status.

  Status is restricted to known values so the database stays consistent.
*/
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "confirmed", "cancelled", "completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Status must be pending, confirmed, cancelled, or completed.",
      });
    }

    /*
      Get the current booking first so we can validate the status transition.

      This protects the business rules at the API level, not only in the UI.
      Even if someone sends a request directly through Postman, the backend
      will still reject invalid status changes.
    */
    const [bookingRows] = await db.query(
      "SELECT id, status FROM bookings WHERE id = ?",
      [id]
    );

    const bookings = bookingRows as any[];

    if (bookings.length === 0) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const currentStatus = bookings[0].status;

    const allowedTransitions: Record<string, string[]> = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };

    const validNextStatuses = allowedTransitions[currentStatus] || [];

    if (!validNextStatuses.includes(status)) {
      return res.status(400).json({
        message: `Cannot change booking status from ${currentStatus} to ${status}.`,
      });
    }

    await db.query("UPDATE bookings SET status = ? WHERE id = ?", [
      status,
      id,
    ]);

    return res.json({
      message: "Booking status updated successfully.",
    });
  } catch (error) {
    console.error("Error updating booking status:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

/*
  Delete a booking by ID.

  This is useful during development and admin cleanup. In a production app,
  cancelled bookings are often kept for history instead of deleted.
*/
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.id);

    const [result]: any = await db.query("DELETE FROM bookings WHERE id = ?", [
      bookingId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Failed to delete booking" });
  }
};