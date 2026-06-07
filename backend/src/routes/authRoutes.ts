import express from "express";
import { loginAdmin, getAdminProfile } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Admin login
 *     description: Logs in an admin and returns a JWT token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@test.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", loginAdmin);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get logged-in admin profile
 *     description: Checks if the admin token is valid and returns admin information.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile returned successfully
 *       401:
 *         description: Invalid or missing token
 */
router.get("/me", authMiddleware, getAdminProfile);

export default router;