import { useEffect, useState } from "react";
import  type { Car } from "../types/Car";
import { getCars } from "../services/carService";
import CarCard from "../components/CarCard";

function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await getCars();
        setCars(data);
      } catch (error) {
        console.error("Failed to load cars:", error);
        setError("Failed to load cars. Please check if the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  if (loading) {
    return <div className="container mt-4">Loading cars...</div>;
  }

  if (error) {
    return <div className="container mt-4 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Available Cars</h1>

      {cars.length === 0 ? (
        <p>No cars available yet.</p>
      ) : (
        <div className="row g-4">
          {cars.map((car) => (
            <div className="col-md-4" key={car.id}>
              <CarCard car={car} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CarsPage;