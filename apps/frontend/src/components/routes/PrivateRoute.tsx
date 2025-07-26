import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../lib/contexts/auth/AuthContext";
import { Loader2 } from "lucide-react";

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
