import { Link } from "react-router-dom";
import type { Car } from "../types/Car";

type CarCardProps = {
  car: Car;
};

function CarCard({ car }: CarCardProps) {
  return (
    <div className="card h-100">
      <img
        src={car.image_url || "https://via.placeholder.com/400x250"}
        className="card-img-top"
        alt={`${car.brand} ${car.model}`}
      />

      <div className="card-body">
        <h5 className="card-title">
          {car.brand} {car.model}
        </h5>

        <p className="card-text">
          {car.year} • {car.car_type}
        </p>

        <p className="fw-bold">${car.daily_rate} / day</p>

        <span className="badge bg-success mb-3">{car.status}</span>

        <br />

        <Link to={`/cars/${car.id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default CarCard;