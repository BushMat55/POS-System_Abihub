import { Navigate } from "react-router-dom";
import { getUser } from "./auth";

function RoleProtectedRoute({ children, allowedRoles }) {

    const user = getUser();

    // 🚫 NOT LOGGED IN
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 🚫 ROLE NOT ALLOWED
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default RoleProtectedRoute;