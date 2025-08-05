import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useContext(UserContext);

  if (user) {
    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to="/not-found" replace />;
    }
  }
  return children;
};

export default ProtectedRoute;
