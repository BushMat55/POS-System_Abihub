import { Navigate } from "react-router-dom";
import { getUser } from "./auth";

function ProtectedRoute({ children }) {

    const user = getUser();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;