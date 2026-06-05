import { useEffect, useState } from "react";
import type { Customer } from "../types/Customer";
import {
  createCustomer,
  getCustomers,
  type CustomerFormData,
} from "../services/customerService";
import AdminNav from "../components/AdminNav";

function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState<CustomerFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to load customers:", error);
      setErrorMessage("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    });
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
    setMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (!formData.first_name || !formData.last_name || !formData.email) {
      setErrorMessage("First name, last name, and email are required.");
      return;
    }

    try {
      setSaving(true);

      await createCustomer(formData);

      setMessage("Customer created successfully.");
      resetForm();
      setShowForm(false);
      await loadCustomers();
    } catch (error: any) {
      console.error("Failed to create customer:", error);

      const backendMessage =
        error.response?.data?.message || "Failed to create customer.";

      setErrorMessage(backendMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading customers...</div>;
  }

  return (
    <div className="container mt-4">
      <AdminNav />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Customers</h1>

        {!showForm && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(true);
              setMessage("");
              setErrorMessage("");
            }}
          >
            Add Customer
          </button>
        )}
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {showForm && (
        <div className="card p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Add New Customer</h5>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  className="form-control"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  className="form-control"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-3">
              <button
                type="submit"
                className="btn btn-success me-2"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Customer"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  {customer.first_name} {customer.last_name}
                </td>
                <td>{customer.email}</td>
                <td>{customer.phone || "N/A"}</td>
              </tr>
            ))}

            {customers.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCustomersPage;