import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RestockHistory() {

    const navigate = useNavigate();

    const [restocks, setRestocks] = useState([]);
    const [loading, setLoading] = useState(false);

    // =========================
    // FETCH RESTOCK HISTORY
    // =========================
    const fetchRestocks = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:8080/api/products/restocks/recent",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setRestocks(res.data);

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to load restock history"
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestocks();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    Restock History
                </h1>

                <button
                    onClick={fetchRestocks}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                    Refresh
                </button>

            </div>

            {/* LOADING */}
            {loading && (
                <p className="text-gray-600">
                    Loading restock history...
                </p>
            )}

            {/* TABLE */}
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">

                <table className="w-full border-collapse">

                    <thead>
                        <tr className="bg-gray-200">

                            <th className="border p-3 text-left">
                                Product
                            </th>

                            <th className="border p-3 text-left">
                                Barcode
                            </th>

                            <th className="border p-3 text-left">
                                Quantity Added
                            </th>

                            <th className="border p-3 text-left">
                                Performed By
                            </th>

                            <th className="border p-3 text-left">
                                Date
                            </th>

                        </tr>
                    </thead>

                    <tbody>

                        {restocks.length === 0 ? (

                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center p-5 text-gray-500"
                                >
                                    No restock history found
                                </td>
                            </tr>

                        ) : (

                            restocks.map((r) => (

                                <tr
                                    key={r.id}
                                    className="hover:bg-gray-50 transition"
                                >

                                    <td className="border p-3 font-semibold">
                                        {r.productName}
                                    </td>

                                    <td className="border p-3">
                                        {r.barcode}
                                    </td>

                                    <td className="border p-3 text-green-600 font-bold">
                                        +{r.quantityAdded}
                                    </td>

                                    <td className="border p-3">
                                        {r.performedBy}
                                    </td>

                                    <td className="border p-3 text-sm text-gray-600">
                                        {new Date(r.createdAt).toLocaleString()}
                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

            {/* 🔥 BACK BUTTON */}
            <div className="mt-6">

                <button
                    onClick={() => navigate("/Dashboard")}
                    className="bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-lg"
                >
                    ← Back to Dashboard
                </button>

            </div>

        </div>
    );
}

export default RestockHistory;