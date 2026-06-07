import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type ProtectedAdminRouteProps = {
  children: React.ReactNode;
};

function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { isAdminLoggedIn } = useAuth();

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;