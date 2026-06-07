import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Car } from "../types/Car";
import { getCars } from "../services/carService";
import ".././App.css"

function HomePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await getCars();
        setCars(data.slice(0, 5));
      } catch (error) {
        console.error("Failed to load featured cars:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="hero-badge">Premium Car Rental</span>

              <h1 className="hero-title">
                Find the perfect car for your next trip.
              </h1>

              <p className="hero-text">
                Browse reliable rental cars, compare daily rates, and send a
                booking request in just a few clicks.
              </p>

              <div className="d-flex gap-3 flex-wrap">
                <div className="d-flex gap-3 flex-wrap">
                  <Link to="/cars" className="btn btn-primary btn-lg">
                    Browse Cars
                  </Link>

                  <Link to="/admin/login" className="btn btn-outline-primary btn-lg">
                    Admin Login
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hero-card">
                <div className="hero-card-top">
                  <span>Available Now</span>
                  <span className="hero-dot"></span>
                </div>

                <h3>Easy booking. Flexible pickup.</h3>

                <p>
                  Choose pickup or delivery, select your rental schedule, and
                  wait for admin confirmation.
                </p>

                <div className="hero-stats">
                  <div>
                    <strong>{cars.length}+</strong>
                    <span>Featured Cars</span>
                  </div>

                  <div>
                    <strong>₱500</strong>
                    <span>Delivery Fee</span>
                  </div>

                  <div>
                    <strong>24/7</strong>
                    <span>Booking Request</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <div className="section-heading text-center">
            <span>Featured Vehicles</span>
            <h2>Explore cars ready for booking</h2>
            <p>
              Click any car in the carousel to view details and submit a booking
              request.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-5">Loading featured cars...</div>
          ) : cars.length === 0 ? (
            <div className="alert alert-info text-center">
              No cars available yet.
            </div>
          ) : (
            <div
              id="featuredCarsCarousel"
              className="carousel slide featured-carousel"
              data-bs-ride="carousel"
            >
              <div className="carousel-indicators">
                {cars.map((car, index) => (
                  <button
                    key={car.id}
                    type="button"
                    data-bs-target="#featuredCarsCarousel"
                    data-bs-slide-to={index}
                    className={index === 0 ? "active" : ""}
                    aria-current={index === 0 ? "true" : undefined}
                    aria-label={`Slide ${index + 1}`}
                  ></button>
                ))}
              </div>

              <div className="carousel-inner">
                {cars.map((car, index) => (
                  <div
                    key={car.id}
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                  >
                    <Link to={`/cars/${car.id}`} className="carousel-car-link">
                      <div className="carousel-car-card">
                        <div className="row align-items-center g-4">
                          <div className="col-lg-6">
                           <img
                              src={car.image_url || "https://placehold.co/800x500?text=Car+Image"}
                              alt={`${car.brand} ${car.model}`}
                              className="carousel-car-image"
                            />
                          </div>

                          <div className="col-lg-6">
                            <div className="carousel-car-content">
                              <span className="car-type">{car.car_type}</span>

                              <h3>
                                {car.brand} {car.model}
                              </h3>

                              <p className="car-year">{car.year}</p>

                              <p className="car-description">
                                A reliable rental option for your next drive.
                                View details, check the daily rate, and submit
                                your booking request.
                              </p>

                              <div className="car-price">
                                ₱{Number(car.daily_rate).toFixed(2)}
                                <span>/ day</span>
                              </div>

                              <button className="btn btn-light mt-3">
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#featuredCarsCarousel"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon"></span>
                <span className="visually-hidden">Previous</span>
              </button>

              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#featuredCarsCarousel"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;