import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";

import AddProduct from "./pages/AddProduct";
import Restock from "./pages/Restock";
import UpdatePrice from "./pages/UpdatePrice";
import StockView from "./pages/StockView";
import Sales from "./pages/Sales";
import SalesReport from "./pages/SalesReport";
import RestockHistory from "./pages/RestockHistory";
import TodaySales from "./pages/TodaySales";
import CreateUser from "./pages/CreateUser";
import ResetPassword from "./pages/ResetPassword";

import ProtectedRoute from "./utils/ProtectedRoute";
import RoleProtectedRoute from "./utils/RoleProtectedRoute";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =========================
                    PUBLIC ROUTES
                ========================= */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />

                {/* =========================
                    DASHBOARD (ANY LOGGED USER)
                ========================= */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* =========================
                    CASHIER + MANAGER ROUTES
                ========================= */}

                <Route
                    path="/sales"
                    element={
                        <RoleProtectedRoute allowedRoles={["MANAGER", "CASHIER"]}>
                            <Sales />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/today-sales"
                    element={
                        <RoleProtectedRoute allowedRoles={["MANAGER", "CASHIER"]}>
                            <TodaySales />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/reset-password"
                    element={
                        <RoleProtectedRoute allowedRoles={["MANAGER", "CASHIER"]}>
                            <ResetPassword />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/stock"
                    element={
                        <RoleProtectedRoute allowedRoles={["MANAGER", "CASHIER"]}>
                            <StockView />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/add-product"
                    element={
                        <RoleProtectedRoute allowedRoles={["MANAGER", "CASHIER"]}>
                            <AddProduct />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/restock"
                    element={
                        <RoleProtectedRoute allowedRoles={["MANAGER", "CASHIER"]}>
                            <Restock />
                        </RoleProtectedRoute>
                    }
                />

                {/* =========================
                    MANAGER ONLY ROUTES
                ========================= */}

                <Route
                    path="/update-price"
                    element={
                        <RoleProtectedRoute allowedRoles={["MANAGER"]}>
                            <UpdatePrice />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/create-user"
                    element={
                        <RoleProtectedRoute allowedRoles={["MANAGER"]}>
                            <CreateUser />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/reports/sales"
                    element={
                        <RoleProtectedRoute allowedRoles={["MANAGER"]}>
                            <SalesReport />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/restock-history"
                    element={
                        <RoleProtectedRoute allowedRoles={["MANAGER"]}>
                            <RestockHistory />
                        </RoleProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;