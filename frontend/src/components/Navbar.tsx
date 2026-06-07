import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAdminLoggedIn } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg app-navbar">
      <div className="container">
        <Link className="navbar-brand app-logo" to="/">
          CarRental
        </Link>

        <div className="navbar-nav ms-auto">
          <Link className="nav-link app-nav-link" to="/">
            Home
          </Link>

          <Link className="nav-link app-nav-link" to="/cars">
            Cars
          </Link>

          {isAdminLoggedIn ? (
            <Link className="nav-link app-nav-link" to="/admin">
              Admin
            </Link>
          ) : (
            <Link className="nav-link app-nav-link" to="/admin/login">
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;