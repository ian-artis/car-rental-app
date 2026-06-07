import express from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
} from "../controllers/customerController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         first_name:
 *           type: string
 *           example: John
 *         last_name:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         phone:
 *           type: string
 *           example: "5551234567"
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     description: Admin only. Requires Bearer token.
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers
 *       401:
 *         description: Access denied. No token provided.
 */
router.get("/", authMiddleware, getCustomers);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     description: Admin only. Requires Bearer token.
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer found
 *       401:
 *         description: Access denied. No token provided.
 *       404:
 *         description: Customer not found
 */
router.get("/:id", authMiddleware, getCustomerById);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a customer
 *     description: Public route. Used when a customer submits booking information.
 *     tags:
 *       - Customers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *             properties:
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
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Customer email already exists
 */
router.post("/", createCustomer);

export default router;