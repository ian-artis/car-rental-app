import express from "express";
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from "../controllers/carController";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         brand:
 *           type: string
 *           example: Toyota
 *         model:
 *           type: string
 *           example: Corolla
 *         year:
 *           type: integer
 *           example: 2022
 *         car_type:
 *           type: string
 *           example: Sedan
 *         daily_rate:
 *           type: number
 *           example: 45.00
 *         status:
 *           type: string
 *           example: available
 *         image_url:
 *           type: string
 *           example: https://via.placeholder.com/400x250
 */

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Get all cars
 *     tags:
 *       - Cars
 *     responses:
 *       200:
 *         description: List of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 */
router.get("/", getCars);

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     summary: Get a car by ID
 *     tags:
 *       - Cars
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Car ID
 *     responses:
 *       200:
 *         description: Car found
 *       404:
 *         description: Car not found
 */
router.get("/:id", getCarById);

/**
 * @swagger
 * /api/cars:
 *   post:
 *     summary: Create a new car
 *     tags:
 *       - Cars
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brand
 *               - model
 *               - year
 *               - car_type
 *               - daily_rate
 *             properties:
 *               brand:
 *                 type: string
 *                 example: Nissan
 *               model:
 *                 type: string
 *                 example: Altima
 *               year:
 *                 type: integer
 *                 example: 2020
 *               car_type:
 *                 type: string
 *                 example: Sedan
 *               daily_rate:
 *                 type: number
 *                 example: 42.5
 *               status:
 *                 type: string
 *                 example: available
 *               image_url:
 *                 type: string
 *                 example: https://via.placeholder.com/400x250
 *     responses:
 *       201:
 *         description: Car created successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/", createCar);

/**
 * @swagger
 * /api/cars/{id}:
 *   put:
 *     summary: Update a car
 *     tags:
 *       - Cars
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Car ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *                 example: Toyota
 *               model:
 *                 type: string
 *                 example: Corolla
 *               year:
 *                 type: integer
 *                 example: 2022
 *               car_type:
 *                 type: string
 *                 example: Sedan
 *               daily_rate:
 *                 type: number
 *                 example: 48
 *               status:
 *                 type: string
 *                 example: available
 *               image_url:
 *                 type: string
 *                 example: https://via.placeholder.com/400x250
 *     responses:
 *       200:
 *         description: Car updated successfully
 *       404:
 *         description: Car not found
 */
router.put("/:id", updateCar);

/**
 * @swagger
 * /api/cars/{id}:
 *   delete:
 *     summary: Delete a car
 *     tags:
 *       - Cars
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Car ID
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       404:
 *         description: Car not found
 */
router.delete("/:id", deleteCar);

export default router;