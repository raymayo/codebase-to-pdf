import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const authUser = JSON.parse(sessionStorage.getItem("authUser"));

  const isAuthenticated = authUser !== null;
  const isAdmin = authUser?.role === "admin";

  console.log("Is Authenticated:", isAuthenticated);
  console.log("Is Admin:", isAdmin);

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin" replace />; // Optional: a 403 page
  }

  return <Outlet />;
};

export default ProtectedRoute;
