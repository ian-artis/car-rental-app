import { Request, Response } from "express";
import db from "../config/db";

/*
  Calculate rental days using pickup and return datetime.
*/
const calculateRentalDays = (pickupDateTime: string, returnDateTime: string) => {
  const pickup = new Date(pickupDateTime);
  const returned = new Date(returnDateTime);

  const differenceMs = returned.getTime() - pickup.getTime();
  const days = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

  return days;
};

/*
  Get all bookings with related customer and car information.
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
        bookings.pickup_datetime,
        bookings.return_datetime,
        bookings.delivery_option,
        bookings.delivery_fee,
        bookings.valid_id_1_url,
        bookings.valid_id_2_url,
        bookings.total_price,
        bookings.status,
        bookings.created_at,
        customers.first_name,
        customers.last_name,
        customers.email,
        customers.phone,
        customers.address,
        cars.brand,
        cars.model,
        cars.year,
        cars.daily_rate
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
        bookings.pickup_datetime,
        bookings.return_datetime,
        bookings.delivery_option,
        bookings.delivery_fee,
        bookings.valid_id_1_url,
        bookings.valid_id_2_url,
        bookings.total_price,
        bookings.status,
        bookings.created_at,
        customers.first_name,
        customers.last_name,
        customers.email,
        customers.phone,
        customers.address,
        cars.brand,
        cars.model,
        cars.year,
        cars.daily_rate
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
  Create a new public booking request.

  The customer does not need to already exist.
  The backend creates or reuses the customer by email, then creates
  a pending booking request.
*/
export const createBooking = async (req: Request, res: Response) => {
  try {
    const {
      car_id,
      first_name,
      last_name,
      email,
      phone,
      address,
      pickup_datetime,
      return_datetime,
      delivery_option = "pickup",
    } = req.body;

    if (
      !car_id ||
      !first_name ||
      !last_name ||
      !email ||
      !phone ||
      !address ||
      !pickup_datetime ||
      !return_datetime
    ) {
      return res.status(400).json({
        message:
          "Car, full name, email, phone, address, pickup date/time, and return date/time are required.",
      });
    }

    const allowedDeliveryOptions = ["pickup", "delivery"];

    if (!allowedDeliveryOptions.includes(delivery_option)) {
      return res.status(400).json({
        message: "Delivery option must be either pickup or delivery.",
      });
    }

    const rentalDays = calculateRentalDays(pickup_datetime, return_datetime);

    if (rentalDays <= 0) {
      return res.status(400).json({
        message: "Return date and time must be after pickup date and time.",
      });
    }

    const [carRows]: any = await db.query("SELECT * FROM cars WHERE id = ?", [
      car_id,
    ]);

    if (carRows.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }

    const car = carRows[0];

    const [overlapRows]: any = await db.query(
      `
      SELECT id FROM bookings
      WHERE car_id = ?
      AND status IN ('pending', 'confirmed')
      AND pickup_datetime < ?
      AND return_datetime > ?
      `,
      [car_id, return_datetime, pickup_datetime]
    );

    if (overlapRows.length > 0) {
      return res.status(409).json({
        message: "Car is already booked for the selected date and time.",
      });
    }

    const [existingCustomers]: any = await db.query(
      "SELECT id FROM customers WHERE email = ?",
      [email]
    );

    let customerId: number;

    if (existingCustomers.length > 0) {
      customerId = existingCustomers[0].id;

      await db.query(
        `
        UPDATE customers
        SET first_name = ?, last_name = ?, phone = ?, address = ?
        WHERE id = ?
        `,
        [first_name, last_name, phone, address, customerId]
      );
    } else {
      const [customerResult]: any = await db.query(
        `
        INSERT INTO customers
        (first_name, last_name, email, phone, address)
        VALUES (?, ?, ?, ?, ?)
        `,
        [first_name, last_name, email, phone, address]
      );

      customerId = customerResult.insertId;
    }

    const rentalPrice = rentalDays * Number(car.daily_rate);
    const deliveryFee = delivery_option === "delivery" ? 25 : 0;
    const totalPrice = rentalPrice + deliveryFee;

    const pickupDateOnly = pickup_datetime.split("T")[0];
    const returnDateOnly = return_datetime.split("T")[0];

    const [bookingResult]: any = await db.query(
      `
      INSERT INTO bookings
      (
        customer_id,
        car_id,
        pickup_date,
        return_date,
        pickup_datetime,
        return_datetime,
        delivery_option,
        delivery_fee,
        total_price,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        customerId,
        car_id,
        pickupDateOnly,
        returnDateOnly,
        pickup_datetime,
        return_datetime,
        delivery_option,
        deliveryFee,
        totalPrice,
        "pending",
      ]
    );

    res.status(201).json({
      message: "Booking request submitted successfully.",
      bookingId: bookingResult.insertId,
      customerId,
      rentalDays,
      rentalPrice,
      deliveryFee,
      totalPrice,
      status: "pending",
      deliveryNotice:
        delivery_option === "delivery"
          ? "Delivery selected. An additional delivery fee has been added."
          : null,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

/*
  Update the booking status.
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