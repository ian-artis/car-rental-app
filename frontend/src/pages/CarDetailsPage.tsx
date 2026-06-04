import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Car } from "../types/Car";
import { getCarById } from "../services/carService";

function CarDetailsPage() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCar = async () => {
      if (!id) return;

      try {
        const data = await getCarById(id);
        setCar(data);
      } catch (error) {
        console.error("Failed to load car:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [id]);

  if (loading) {
    return <div className="container mt-4">Loading car details...</div>;
  }

  if (!car) {
    return <div className="container mt-4 alert alert-danger">Car not found.</div>;
  }

  return (
    <div className="container mt-4">
      <Link to="/cars" className="btn btn-outline-secondary mb-3">
        Back to Cars
      </Link>

      <div className="row">
        <div className="col-md-6">
          <img
            src={car.image_url || "https://via.placeholder.com/600x350"}
            alt={`${car.brand} ${car.model}`}
            className="img-fluid rounded"
          />
        </div>

        <div className="col-md-6">
          <h1>
            {car.brand} {car.model}
          </h1>

          <p className="text-muted">
            {car.year} • {car.car_type}
          </p>

          <h3>${car.daily_rate} / day</h3>

          <p>
            Status: <span className="badge bg-success">{car.status}</span>
          </p>

          <button className="btn btn-primary">Book This Car</button>
        </div>
      </div>
    </div>
  );
}

export default CarDetailsPage;