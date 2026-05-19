import { jwtDecode } from "jwt-decode";

// =========================
// GET LOGGED USER
// =========================
export const getUser = () => {

    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
        return jwtDecode(token);
    } catch (error) {
        return null;
    }
};

// =========================
// LOGOUT (CLEAN + SAFE)
// =========================
export const logout = (navigate) => {

    // CLEAR AUTH DATA
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    // REDIRECT TO LANDING PAGE
    navigate("/", { replace: true });
};