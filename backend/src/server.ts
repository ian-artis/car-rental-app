import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import carRoutes from "./routes/carRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Car Rental API is running");
});

app.use("/api/cars", carRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});