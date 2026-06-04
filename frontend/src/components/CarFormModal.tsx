import { useEffect, useState } from "react";
import type { Car } from "../types/Car";
import type { CarFormData } from "../services/carService";

type CarFormModalProps = {
  show: boolean;
  selectedCar: Car | null;
  onClose: () => void;
  onSubmit: (formData: CarFormData) => Promise<void>;
};

function CarFormModal({
  show,
  selectedCar,
  onClose,
  onSubmit,
}: CarFormModalProps) {
  const [formData, setFormData] = useState<CarFormData>({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    car_type: "",
    daily_rate: 0,
    status: "available",
    image_url: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCar) {
      setFormData({
        brand: selectedCar.brand,
        model: selectedCar.model,
        year: selectedCar.year,
        car_type: selectedCar.car_type,
        daily_rate: Number(selectedCar.daily_rate),
        status: selectedCar.status,
        image_url: selectedCar.image_url || "",
      });
    } else {
      setFormData({
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        car_type: "",
        daily_rate: 0,
        status: "available",
        image_url: "",
      });
    }
  }, [selectedCar, show]);

  if (!show) {
    return null;
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "year" || name === "daily_rate" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedCar ? "Edit Car" : "Add New Car"}
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      className="form-control"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Model</label>
                    <input
                      type="text"
                      name="model"
                      className="form-control"
                      value={formData.model}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Year</label>
                    <input
                      type="number"
                      name="year"
                      className="form-control"
                      value={formData.year}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Car Type</label>
                    <input
                      type="text"
                      name="car_type"
                      className="form-control"
                      value={formData.car_type}
                      onChange={handleChange}
                      placeholder="Sedan, SUV, Truck"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Daily Rate</label>
                    <input
                      type="number"
                      name="daily_rate"
                      className="form-control"
                      value={formData.daily_rate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      className="form-select"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="text"
                      name="image_url"
                      className="form-control"
                      value={formData.image_url}
                      onChange={handleChange}
                      placeholder="https://example.com/car.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Car"}
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

export default CarFormModal;