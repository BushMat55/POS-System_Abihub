import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getUser, logout } from "../utils/auth";

function Dashboard() {

    const navigate = useNavigate();
    const user = getUser();

    // 🔐 PROTECT ROUTE
    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login", { replace: true });
        }

        // 🚫 BLOCK BACK BUTTON AFTER LOGOUT
        const handlePopState = () => {
            navigate("/login", { replace: true });
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };

    }, [navigate]);

    // 🚪 LOGOUT
    const handleLogout = () => {

        logout(navigate);

        window.history.replaceState(null, "", "/login");
    };

    return (

        <div className="min-h-screen bg-gray-100">

            {/* TOP BAR */}
            <div className="bg-green-600 text-white px-6 py-4 flex justify-between items-center shadow-md">

                <h1 className="text-2xl font-bold tracking-wide">
                    🧾 TEL AVIV POS SYSTEM
                </h1>

                <div className="flex items-center gap-4">

                    {user && (
                        <div className="text-sm bg-green-700 px-3 py-1 rounded-full">
                            👤 {user.sub} | 🛡️ {user.role}
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg text-sm transition"
                    >
                        Logout
                    </button>

                </div>

            </div>

            {/* MAIN CONTENT */}
            <div className="p-8">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* =========================
                        BOTH MANAGER + CASHIER
                    ========================= */}

                    <button
                        onClick={() => navigate("/sales")}
                        className="bg-blue-700 hover:bg-blue-800 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
                    >
                        🛒 Open POS
                    </button>

                    <button
                        onClick={() => navigate("/today-sales")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
                    >
                        📅 View Today's Sales
                    </button>


                            <button
                                onClick={() => navigate("/restock")}
                                className="bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
                            >
                                🔄 Restock Product
                            </button>


                            <button
                                onClick={() => navigate("/add-product")}
                                className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
                            >
                                ➕ Add New Product
                            </button>



                    <button
                        onClick={() => navigate("/reset-password")}
                        className="bg-red-600 hover:bg-red-700 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
                    >
                        🔐 Reset Password
                    </button>

                    {/* =========================
                        MANAGER ONLY
                    ========================= */}
                    {user?.role === "MANAGER" && (
                        <>

                            <button
                                onClick={() => navigate("/stock")}
                                className="bg-black hover:bg-gray-800 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
                            >
                                📦 View Available Stock
                            </button>

                            <button
                                onClick={() => navigate("/update-price")}
                                className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
                            >
                                💲 Update Product Price
                            </button>

                            <button
                                onClick={() => navigate("/reports/sales")}
                                className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
                            >
                                📊 View Sales Reports
                            </button>

                            <button
                                onClick={() => navigate("/restock-history")}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
                            >
                                📜 View Restock History
                            </button>

                            <button
                                onClick={() => navigate("/create-user")}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
                            >
                                👤 Create Staff User
                            </button>

                        </>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Dashboard;