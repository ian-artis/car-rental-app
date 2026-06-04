import { useEffect, useState } from "react";
import type { Car } from "../types/Car";
import {
  createCar,
  deleteCar,
  getCars,
  updateCar,
  type CarFormData,
} from "../services/carService";
import CarFormModal from "../components/CarFormModal";

function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadCars = async () => {
    try {
      setLoading(true);
      const data = await getCars();
      setCars(data);
    } catch (error) {
      console.error("Failed to load cars:", error);
      setErrorMessage("Failed to load cars.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const openAddModal = () => {
    setSelectedCar(null);
    setShowFormModal(true);
  };

  const openEditModal = (car: Car) => {
    setSelectedCar(car);
    setShowFormModal(true);
  };

  const closeModal = () => {
    setShowFormModal(false);
    setSelectedCar(null);
  };

  const handleSubmitCar = async (formData: CarFormData) => {
    setMessage("");
    setErrorMessage("");

    try {
      if (selectedCar) {
        await updateCar(selectedCar.id, formData);
        setMessage("Car updated successfully.");
      } else {
        await createCar(formData);
        setMessage("Car created successfully.");
      }

      await loadCars();
    } catch (error) {
      console.error("Failed to save car:", error);
      setErrorMessage("Failed to save car.");
    }
  };

  const handleDeleteCar = async (carId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this car?");

    if (!confirmed) {
      return;
    }

    setMessage("");
    setErrorMessage("");

    try {
      await deleteCar(carId);
      setMessage("Car deleted successfully.");
      await loadCars();
    } catch (error: any) {
      console.error("Failed to delete car:", error);

      const backendMessage =
        error.response?.data?.message || "Failed to delete car.";

      setErrorMessage(backendMessage);
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading admin cars...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Cars</h1>

        <button className="btn btn-primary" onClick={openAddModal}>
          Add Car
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Car</th>
              <th>Year</th>
              <th>Type</th>
              <th>Daily Rate</th>
              <th>Status</th>
              <th style={{ width: "180px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td>{car.id}</td>
                <td>
                  {car.brand} {car.model}
                </td>
                <td>{car.year}</td>
                <td>{car.car_type}</td>
                <td>${car.daily_rate}</td>
                <td>
                  <span className="badge bg-success">{car.status}</span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => openEditModal(car)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteCar(car.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {cars.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center">
                  No cars found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CarFormModal
        show={showFormModal}
        selectedCar={selectedCar}
        onClose={closeModal}
        onSubmit={handleSubmitCar}
      />
    </div>
  );
}

export default AdminCarsPage;