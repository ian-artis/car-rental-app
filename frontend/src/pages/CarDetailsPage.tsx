import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCarById } from "../services/carService";
import type { Car } from "../types/Car";
import BookingModal from "../components/BookingModal";

function CarDetailsPage() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const loadCar = async () => {
      try {
        setLoading(true);

        if (!id) {
          setErrorMessage("Car ID is missing.");
          return;
        }

        const data = await getCarById(id);
        setCar(data);
      } catch (error) {
        console.error("Failed to load car details:", error);
        setErrorMessage("Failed to load car details.");
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [id]);

  if (loading) {
    return <div className="container mt-5">Loading car details...</div>;
  }

  if (errorMessage || !car) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {errorMessage || "Car not found."}
        </div>
      </div>
    );
  }

  const isAvailable = car.status === "available";

  return (
    <div className="car-details-page">
      <div className="container">
        <div className="car-details-topbar">
          <Link to="/cars" className="btn btn-outline-primary">
            ← Back to Cars
          </Link>
        </div>

        <div className="car-details-shell">
          <div className="row g-4 align-items-stretch">
            <div className="col-lg-6">
              <div className="car-details-image-card">
                <img
                  src={
                    car.image_url ||
                    "https://placehold.co/900x600?text=Car+Image"
                  }
                  alt={`${car.brand} ${car.model}`}
                  className="car-details-image"
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="car-details-info-card">
                <span className="details-badge">{car.car_type}</span>

                <h1 className="car-details-title">
                  {car.brand} {car.model}
                </h1>

                <p className="car-details-subtitle">
                  {car.year} • Premium rental option
                </p>

                <div className="car-details-price">
                  ₱{Number(car.daily_rate).toFixed(2)}
                  <span>/ day</span>
                </div>

                <div className="car-details-status">
                  <span className="status-label">Status:</span>
                  <span
                    className={`badge ${
                      isAvailable ? "bg-success" : "bg-warning text-dark"
                    }`}
                  >
                    {car.status}
                  </span>
                </div>

                <p className="car-details-description">
                  Enjoy a smooth and reliable rental experience with this{" "}
                  {car.brand} {car.model}. Perfect for city driving, family
                  trips, or everyday transportation. Choose your rental schedule
                  and submit your booking request in just a few clicks.
                </p>

                <div className="car-spec-grid">
                  <div className="car-spec-box">
                    <span>Brand</span>
                    <strong>{car.brand}</strong>
                  </div>

                  <div className="car-spec-box">
                    <span>Model</span>
                    <strong>{car.model}</strong>
                  </div>

                  <div className="car-spec-box">
                    <span>Year</span>
                    <strong>{car.year}</strong>
                  </div>

                  <div className="car-spec-box">
                    <span>Type</span>
                    <strong>{car.car_type}</strong>
                  </div>
                </div>

                <div className="car-details-cta">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => setShowBookingModal(true)}
                    disabled={!isAvailable}
                  >
                    {isAvailable ? "Book This Car" : "Currently Unavailable"}
                  </button>

                  <Link to="/cars" className="btn btn-outline-primary btn-lg">
                    View More Cars
                  </Link>
                </div>

                <div className="car-details-note">
                  <strong>Note:</strong> Delivery option is available with an
                  additional fee.
                </div>
              </div>
            </div>
          </div>
        </div>

        <BookingModal
          carId={car.id}
          carName={`${car.brand} ${car.model}`}
          show={showBookingModal}
          onClose={() => setShowBookingModal(false)}
        />
      </div>
    </div>
  );
}

export default CarDetailsPage;