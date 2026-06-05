import { useEffect, useMemo, useState } from "react";
import type { Car } from "../types/Car";
import { getCars } from "../services/carService";
import CarCard from "../components/CarCard";

function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortOption, setSortOption] = useState("default");

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

  /*
    Build a unique list of car types from the loaded cars.

    This keeps the filter dynamic, so adding a new car type in the admin
    dashboard automatically makes it available as a filter option.
  */
  const carTypes = useMemo(() => {
    const types = cars.map((car) => car.car_type);
    return Array.from(new Set(types));
  }, [cars]);

  /*
    Apply search, filters, and sorting on the frontend.

    For this portfolio MVP, client-side filtering is enough because the
    dataset is small. In a larger production app, these filters would often
    be handled by the backend with query parameters.
  */
  const filteredCars = useMemo(() => {
    let result = [...cars];

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();

      result = result.filter((car) => {
        const fullName = `${car.brand} ${car.model}`.toLowerCase();

        return (
          car.brand.toLowerCase().includes(lowerSearch) ||
          car.model.toLowerCase().includes(lowerSearch) ||
          fullName.includes(lowerSearch)
        );
      });
    }

    if (selectedType !== "all") {
      result = result.filter((car) => car.car_type === selectedType);
    }

    if (selectedStatus !== "all") {
      result = result.filter((car) => car.status === selectedStatus);
    }

    if (sortOption === "price-low-high") {
      result.sort((a, b) => Number(a.daily_rate) - Number(b.daily_rate));
    }

    if (sortOption === "price-high-low") {
      result.sort((a, b) => Number(b.daily_rate) - Number(a.daily_rate));
    }

    if (sortOption === "year-new-old") {
      result.sort((a, b) => b.year - a.year);
    }

    return result;
  }, [cars, searchTerm, selectedType, selectedStatus, sortOption]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedStatus("all");
    setSortOption("default");
  };

  if (loading) {
    return <div className="container mt-4">Loading cars...</div>;
  }

  if (error) {
    return <div className="container mt-4 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Available Cars</h1>

        <span className="text-muted">
          Showing {filteredCars.length} of {cars.length} cars
        </span>
      </div>

      <div className="card p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by brand or model..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">Car Type</label>
            <select
              className="form-select"
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
            >
              <option value="all">All Types</option>

              {carTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Sort</label>
            <select
              className="form-select"
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
            >
              <option value="default">Default</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="year-new-old">Year: Newest First</option>
            </select>
          </div>

          <div className="col-md-1 d-flex align-items-end">
            <button className="btn btn-outline-secondary w-100" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {filteredCars.length === 0 ? (
        <div className="alert alert-warning">
          No cars match your search or filters.
        </div>
      ) : (
        <div className="row g-4">
          {filteredCars.map((car) => (
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