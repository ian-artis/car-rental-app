import express from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/bookingController";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         customer_id:
 *           type: integer
 *           example: 1
 *         car_id:
 *           type: integer
 *           example: 1
 *         pickup_date:
 *           type: string
 *           format: date
 *           example: "2026-06-10"
 *         return_date:
 *           type: string
 *           format: date
 *           example: "2026-06-13"
 *         total_price:
 *           type: number
 *           example: 135
 *         status:
 *           type: string
 *           example: pending
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags:
 *       - Bookings
 *     responses:
 *       200:
 *         description: List of bookings with customer and car details
 */
router.get("/", getBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking found
 *       404:
 *         description: Booking not found
 */
router.get("/:id", getBookingById);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a booking
 *     description: Creates a booking, calculates rental price, and prevents overlapping bookings for the same car.
 *     tags:
 *       - Bookings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *               - car_id
 *               - pickup_date
 *               - return_date
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 example: 1
 *               car_id:
 *                 type: integer
 *                 example: 1
 *               pickup_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-10"
 *               return_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-13"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Missing fields or invalid rental dates
 *       404:
 *         description: Customer or car not found
 *       409:
 *         description: Car is already booked for the selected dates
 */
router.post("/", createBooking);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   put:
 *     summary: Update booking status
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *       400:
 *         description: Invalid booking status
 *       404:
 *         description: Booking not found
 */
router.put("/:id/status", updateBookingStatus);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete booking
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 */
router.delete("/:id", deleteBooking);

export default router;