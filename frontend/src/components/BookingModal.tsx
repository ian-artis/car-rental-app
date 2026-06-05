import { useEffect, useState } from "react";
import { createBooking } from "../services/bookingService";
import {
  createCustomer,
  getCustomers,
  type CustomerFormData,
} from "../services/customerService";
import type { Customer } from "../types/Customer";

type BookingModalProps = {
  carId: number;
  carName: string;
  show: boolean;
  onClose: () => void;
};

function BookingModal({ carId, carName, show, onClose }: BookingModalProps) {
  const [customerId, setCustomerId] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);

  const [newCustomer, setNewCustomer] = useState<CustomerFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [rentalDays, setRentalDays] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const resetMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setTotalPrice(null);
    setRentalDays(null);
  };

  const loadCustomers = async () => {
    try {
      setCustomersLoading(true);

      const data = await getCustomers();
      setCustomers(data);

      if (data.length > 0 && !customerId) {
        setCustomerId(String(data[0].id));
      }
    } catch (error) {
      console.error("Failed to load customers:", error);
      setErrorMessage("Failed to load customers.");
    } finally {
      setCustomersLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      loadCustomers();
    }
  }, [show]);

  if (!show) {
    return null;
  }

  const handleClose = () => {
    resetMessages();
    setShowNewCustomerForm(false);
    onClose();
  };

  const handleNewCustomerChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setNewCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  const handleCreateCustomer = async () => {
    resetMessages();

    if (!newCustomer.first_name || !newCustomer.last_name || !newCustomer.email) {
      setErrorMessage("First name, last name, and email are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await createCustomer(newCustomer);

      await loadCustomers();

      setCustomerId(String(response.customerId));
      setShowNewCustomerForm(false);

      setNewCustomer({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      });

      setSuccessMessage("Customer created. You can now submit the booking.");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create customer.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    resetMessages();
    setLoading(true);

    if (showNewCustomerForm) {
      setErrorMessage(
        "Please create the new customer before submitting the booking."
      );
      setLoading(false);
      return;
    }

    if (!customerId) {
      setErrorMessage("Please select a customer.");
      setLoading(false);
      return;
    }

    try {
      const response = await createBooking({
        customer_id: Number(customerId),
        car_id: carId,
        pickup_date: pickupDate,
        return_date: returnDate,
      });

      setSuccessMessage(response.message);
      setRentalDays(response.rentalDays);
      setTotalPrice(response.totalPrice);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create booking.";

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
                        Rental Days: {rentalDays} | Total Price: ${totalPrice}
                      </p>
                    )}
                  </div>
                )}

                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label">Customer</label>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setShowNewCustomerForm((prevValue) => !prevValue);
                        resetMessages();
                      }}
                    >
                      {showNewCustomerForm
                        ? "Use Existing Customer"
                        : "Add New Customer"}
                    </button>
                  </div>

                  {!showNewCustomerForm && (
                    <>
                      <select
                        className="form-select"
                        value={customerId}
                        onChange={(event) => setCustomerId(event.target.value)}
                        disabled={customersLoading || customers.length === 0}
                        required
                      >
                        {customers.length === 0 ? (
                          <option value="">No customers available</option>
                        ) : (
                          customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                              {customer.first_name} {customer.last_name} -{" "}
                              {customer.email}
                            </option>
                          ))
                        )}
                      </select>

                      <div className="form-text">
                        Select an existing customer for this booking.
                      </div>
                    </>
                  )}

                  {showNewCustomerForm && (
                    <div className="border rounded p-3 mt-2 bg-light">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">First Name</label>
                          <input
                            type="text"
                            name="first_name"
                            className="form-control"
                            value={newCustomer.first_name}
                            onChange={handleNewCustomerChange}
                            required
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Last Name</label>
                          <input
                            type="text"
                            name="last_name"
                            className="form-control"
                            value={newCustomer.last_name}
                            onChange={handleNewCustomerChange}
                            required
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={newCustomer.email}
                            onChange={handleNewCustomerChange}
                            required
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Phone</label>
                          <input
                            type="text"
                            name="phone"
                            className="form-control"
                            value={newCustomer.phone}
                            onChange={handleNewCustomerChange}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleCreateCustomer}
                        disabled={loading}
                      >
                        {loading ? "Creating..." : "Create Customer"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Pickup Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={pickupDate}
                    min={today}
                    onChange={(event) => {
                      setPickupDate(event.target.value);
                      setReturnDate("");
                    }}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Return Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={returnDate}
                    min={pickupDate || today}
                    onChange={(event) => setReturnDate(event.target.value)}
                    required
                  />
                </div>
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
                  {loading ? "Submitting..." : "Submit Booking"}
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