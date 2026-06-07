import { useState } from "react";
import { createBooking } from "../services/bookingService";

type BookingModalProps = {
  carId: number;
  carName: string;
  show: boolean;
  onClose: () => void;
};

type BookingFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  pickup_datetime: string;
  return_datetime: string;
  delivery_option: "pickup" | "delivery";
};

function BookingModal({ carId, carName, show, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    pickup_datetime: "",
    return_datetime: "",
    delivery_option: "pickup",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [rentalDays, setRentalDays] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const now = new Date().toISOString().slice(0, 16);

  if (!show) {
    return null;
  }

  const resetMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setTotalPrice(null);
    setDeliveryFee(null);
    setRentalDays(null);
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      pickup_datetime: "",
      return_datetime: "",
      delivery_option: "pickup",
    });
  };

  const handleClose = () => {
    resetMessages();
    resetForm();
    onClose();
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    resetMessages();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    resetMessages();

    if (formData.return_datetime <= formData.pickup_datetime) {
      setErrorMessage("Return date and time must be after pickup date and time.");
      return;
    }

    try {
      setLoading(true);

      const response = await createBooking({
        car_id: carId,
        ...formData,
      });

      setSuccessMessage(response.message);
      setRentalDays(response.rentalDays);
      setDeliveryFee(response.deliveryFee);
      setTotalPrice(response.totalPrice);
      resetForm();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to submit booking request.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Book {carName}</h5>

              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {successMessage && (
                  <div className="alert alert-success">
                    <p className="mb-1">{successMessage}</p>

                    {rentalDays !== null && totalPrice !== null && (
                      <p className="mb-0">
                        Rental Days: {rentalDays} | Delivery Fee: ₱
                        {deliveryFee ?? 0} | Total Price: ₱{totalPrice}
                      </p>
                    )}
                  </div>
                )}

                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}

                <h6 className="mb-3">Customer Information</h6>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      className="form-control"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      className="form-control"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      name="address"
                      className="form-control"
                      rows={2}
                      value={formData.address}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>

                <h6 className="mb-3">Rental Schedule</h6>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Pickup Date and Time</label>
                    <input
                      type="datetime-local"
                      name="pickup_datetime"
                      className="form-control"
                      value={formData.pickup_datetime}
                      min={now}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Return Date and Time</label>
                    <input
                      type="datetime-local"
                      name="return_datetime"
                      className="form-control"
                      value={formData.return_datetime}
                      min={formData.pickup_datetime || now}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <h6 className="mb-3">Pickup Option</h6>

                <div className="mb-3">
                  <select
                    name="delivery_option"
                    className="form-select"
                    value={formData.delivery_option}
                    onChange={handleChange}
                    required
                  >
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>

                {formData.delivery_option === "delivery" && (
                  <div className="alert alert-warning">
                    Delivery selected. An additional ₱500 delivery fee will be
                    added to your total.
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Booking Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal-backdrop show"></div>
    </>
  );
}

export default BookingModal;