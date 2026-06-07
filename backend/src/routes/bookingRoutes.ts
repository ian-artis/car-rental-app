import express from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/bookingController";
import { authMiddleware } from "../middleware/authMiddleware";

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
 *     description: Admin only. Requires Bearer token.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings with customer and car details
 *       401:
 *         description: Access denied. No token provided.
 */
router.get("/", authMiddleware, getBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     description: Admin only. Requires Bearer token.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Access denied. No token provided.
 *       404:
 *         description: Booking not found
 */
router.get("/:id", authMiddleware, getBookingById);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a booking request
 *     description: Public route. Customer submits personal information, selected car, pickup/return date and time, and pickup or delivery option. Booking is created with pending status.
 *     tags:
 *       - Bookings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - car_id
 *               - first_name
 *               - last_name
 *               - email
 *               - phone
 *               - address
 *               - pickup_datetime
 *               - return_datetime
 *             properties:
 *               car_id:
 *                 type: integer
 *                 example: 1
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "5551234567"
 *               address:
 *                 type: string
 *                 example: "123 Main Street, Cebu City"
 *               pickup_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-10T09:00:00"
 *               return_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-13T17:00:00"
 *               delivery_option:
 *                 type: string
 *                 enum: [pickup, delivery]
 *                 example: delivery
 *     responses:
 *       201:
 *         description: Booking request submitted successfully
 *       400:
 *         description: Missing fields, invalid delivery option, or invalid rental date/time
 *       404:
 *         description: Car not found
 *       409:
 *         description: Car is already booked for the selected date and time
 */
router.post("/", createBooking);


/**
 * @swagger
 * /api/bookings/{id}/status:
 *   put:
 *     summary: Update booking status
 *     description: Admin only. Requires Bearer token.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Access denied. No token provided.
 *       404:
 *         description: Booking not found
 */
router.put("/:id/status", authMiddleware, updateBookingStatus);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete booking
 *     description: Admin only. Requires Bearer token.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Access denied. No token provided.
 *       404:
 *         description: Booking not found
 */
router.delete("/:id", authMiddleware, deleteBooking);

export default router;