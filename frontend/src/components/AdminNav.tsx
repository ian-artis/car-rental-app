import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminNav() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex gap-2 flex-wrap justify-content-between align-items-center">
          <div className="d-flex gap-2 flex-wrap">
            <Link className="btn btn-outline-primary" to="/admin">
              Dashboard
            </Link>

            <Link className="btn btn-outline-primary" to="/admin/cars">
              Cars
            </Link>

            <Link className="btn btn-outline-primary" to="/admin/bookings">
              Bookings
            </Link>

            <Link className="btn btn-outline-primary" to="/admin/customers">
              Customers
            </Link>
          </div>

          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminNav;