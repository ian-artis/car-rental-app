import { Link } from "react-router-dom";

function AdminNav() {
  return (
    <div className="card mb-4">
      <div className="card-body">
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
      </div>
    </div>
  );
}

export default AdminNav;