import { useEffect, useState } from "react";
import type { Booking } from "../types/Booking";
import {
  deleteBooking,
  getBookings,
  updateBookingStatus,
} from "../services/bookingService";

function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
      setErrorMessage("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleStatusChange = async (bookingId: number, status: string) => {
    setMessage("");
    setErrorMessage("");

    try {
      await updateBookingStatus(bookingId, status);
      setMessage("Booking status updated successfully.");
      await loadBookings();
    } catch (error: any) {
      console.error("Failed to update booking status:", error);

      const backendMessage =
        error.response?.data?.message || "Failed to update booking status.";

      setErrorMessage(backendMessage);
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setErrorMessage("");

    try {
      await deleteBooking(bookingId);
      setMessage("Booking deleted successfully.");
      await loadBookings();
    } catch (error: any) {
      console.error("Failed to delete booking:", error);

      const backendMessage =
        error.response?.data?.message || "Failed to delete booking.";

      setErrorMessage(backendMessage);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === "confirmed") return "bg-success";
    if (status === "cancelled") return "bg-danger";
    if (status === "completed") return "bg-secondary";

    return "bg-warning text-dark";
  };

  if (loading) {
    return <div className="container mt-4">Loading admin bookings...</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin Bookings</h1>

      {message && <div className="alert alert-success">{message}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Car</th>
              <th>Pickup</th>
              <th>Return</th>
              <th>Total</th>
              <th>Status</th>
              <th style={{ width: "220px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>

                <td>
                  <div>
                    {booking.first_name} {booking.last_name}
                  </div>
                  <small className="text-muted">{booking.email}</small>
                </td>

                <td>
                  {booking.brand} {booking.model} ({booking.year})
                </td>

                <td>{new Date(booking.pickup_date).toLocaleDateString()}</td>
                <td>{new Date(booking.return_date).toLocaleDateString()}</td>

                <td>${booking.total_price}</td>

                <td>
                  <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>

                <td>
                  <select
                    className="form-select form-select-sm mb-2"
                    value={booking.status}
                    onChange={(event) =>
                      handleStatusChange(booking.id, event.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteBooking(booking.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {bookings.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBookingsPage;