import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          CarRental
        </Link>

        <div className="navbar-nav">
          <Link className="nav-link" to="/">
            Home
          </Link>

          <Link className="nav-link" to="/cars">
            Cars
          </Link>

          <Link className="nav-link" to="/admin/cars">
            Admin Cars
          </Link>

          <Link className="nav-link" to="/admin/bookings">
            Admin Bookings
          </Link>

          <Link className="nav-link" to="/admin/customers">
            Admin Customers
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;