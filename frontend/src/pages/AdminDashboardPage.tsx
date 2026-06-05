import { useEffect, useState } from "react";
import { getCars } from "../services/carService";
import { getBookings } from "../services/bookingService";
import { getCustomers } from "../services/customerService";
import type { Car } from "../types/Car";
import type { Booking } from "../types/Booking";
import type { Customer } from "../types/Customer";

function AdminDashboardPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const [carsData, bookingsData, customersData] = await Promise.all([
          getCars(),
          getBookings(),
          getCustomers(),
        ]);

        setCars(carsData);
        setBookings(bookingsData);
        setCustomers(customersData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setErrorMessage("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const totalCars = cars.length;
  const availableCars = cars.filter((car) => car.status === "available").length;
  const rentedCars = cars.filter((car) => car.status === "rented").length;
  const totalCustomers = customers.length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;
  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  if (loading) {
    return <div className="container mt-4">Loading dashboard...</div>;
  }

  if (errorMessage) {
    return <div className="container mt-4 alert alert-danger">{errorMessage}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      <div className="row g-4">
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Total Cars</h6>
              <h2>{totalCars}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Available Cars</h6>
              <h2>{availableCars}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Rented Cars</h6>
              <h2>{rentedCars}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Customers</h6>
              <h2>{totalCustomers}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Total Bookings</h6>
              <h2>{totalBookings}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Pending Bookings</h6>
              <h2>{pendingBookings}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Confirmed Bookings</h6>
              <h2>{confirmedBookings}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4 shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Quick Admin Links</h5>

          <div className="d-flex gap-2 flex-wrap">
            <a href="/admin/cars" className="btn btn-outline-primary">
              Manage Cars
            </a>

            <a href="/admin/bookings" className="btn btn-outline-primary">
              Manage Bookings
            </a>

            <a href="/admin/customers" className="btn btn-outline-primary">
              Manage Customers
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;