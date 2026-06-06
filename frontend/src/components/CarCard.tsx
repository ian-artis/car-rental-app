import { Link } from "react-router-dom";
import type { Car } from "../types/Car";

type CarCardProps = {
  car: Car;
};

function CarCard({ car }: CarCardProps) {
  return (
    <div className="card h-100 shadow-sm">
      {car.image_url ? (
        <img
          src={car.image_url}
          className="card-img-top"
          alt={`${car.brand} ${car.model}`}
          style={{
            height: "220px",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          className="bg-light d-flex align-items-center justify-content-center"
          style={{ height: "220px" }}
        >
          <span className="text-muted">No image available</span>
        </div>
      )}

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">
          {car.brand} {car.model}
        </h5>

        <p className="card-text mb-2">
          {car.year} • {car.car_type}
        </p>

        <p className="fw-bold mb-2">${Number(car.daily_rate).toFixed(2)} / day</p>

        <div className="mb-3">
          <span className="badge bg-success">{car.status}</span>
        </div>

        <div className="mt-auto">
          <Link to={`/cars/${car.id}`} className="btn btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CarCard;