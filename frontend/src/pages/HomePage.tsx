import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="container py-5">
      <div className="p-5 mb-4 bg-light rounded-3">
        <h1 className="display-5 fw-bold">Find Your Next Rental Car</h1>

        <p className="fs-5">
          Browse available cars, compare daily rates, and book your next ride.
        </p>

        <Link to="/cars" className="btn btn-primary btn-lg">
          Browse Cars
        </Link>
      </div>
    </div>
  );
}

export default HomePage;