import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";

import carRoutes from "./routes/carRoutes";
import customerRoutes from "./routes/customerRoutes";
// import bookingRoutes from "./routes/bookingRoutes";

// Load environment variables before starting the server.
dotenv.config();

const app = express();

/*
  Global middleware:
  - cors allows the frontend to call this API from another origin.
  - express.json allows the API to read JSON request bodies.
*/
app.use(cors());
app.use(express.json());

// Swagger UI provides interactive API documentation for testing endpoints.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check route used to confirm that the API server is running.
app.get("/", (req, res) => {
  res.send("Car Rental API is running");
});

// API route groups.
app.use("/api/cars", carRoutes);
app.use("/api/customers", customerRoutes);
// app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});