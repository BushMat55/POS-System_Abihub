import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Restock() {

    const navigate = useNavigate();

    const [barcode, setBarcode] = useState("");
    const [quantity, setQuantity] = useState("");

    // =========================
    // SEARCH STATES
    // =========================
    const [productName, setProductName] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [loading, setLoading] = useState(false);

    // =========================
    // INPUT REF
    // =========================
    const barcodeRef = useRef(null);

    // =========================
    // AUTOFOCUS
    // =========================
    useEffect(() => {
        barcodeRef.current?.focus();
    }, []);

    // =========================
    // SEARCH PRODUCT NAME
    // =========================
    const handleSearchProduct = async (value) => {

        setProductName(value);

        if (value.trim().length < 1) {
            setSearchResults([]);
            setShowSuggestions(false);
            return;
        }

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/api/products/search-by-name",
                {
                    params: {
                        keyword: value
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSearchResults(response.data.data || []);
            setShowSuggestions(true);

        } catch (error) {
            console.log(error);
        }
    };

    // =========================
    // SELECT PRODUCT
    // =========================
    const handleSelectProduct = (product) => {

        setProductName(product.name);
        setBarcode(product.barcode);

        setSearchResults([]);
        setShowSuggestions(false);

        // Focus quantity input
        document.getElementById("quantityInput")?.focus();
    };

    // =========================
    // RESTOCK
    // =========================
    const handleRestock = async (e) => {

        e.preventDefault();

        if (Number(quantity) <= 0) {
            alert("❌ Quantity must be greater than 0");
            return;
        }

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:8080/api/products/restock/${barcode}`,
                {},
                {
                    params: { quantity },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("✅ Restocked successfully");

            // RESET
            setBarcode("");
            setQuantity("");
            setProductName("");
            setSearchResults([]);
            setShowSuggestions(false);

            // RETURN FOCUS
            barcodeRef.current?.focus();

        } catch (error) {

            if (error.response?.status === 403) {
                alert("❌ Product not available. Please add!!");
                return;
            }

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Restock failed";

            alert("❌ " + message);

        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="p-10 bg-gray-100 min-h-screen flex justify-center">

            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

                <h2 className="text-2xl font-bold mb-6">
                    Restock Product
                </h2>

                <form onSubmit={handleRestock} className="space-y-4">

                    {/* =========================
                        PRODUCT NAME SEARCH
                    ========================= */}

                    <div className="relative">

                        <input
                            type="text"
                            placeholder="Search Product Name"
                            value={productName}
                            onChange={(e) =>
                                handleSearchProduct(e.target.value)
                            }
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {/* =========================
                            SEARCH RESULTS
                        ========================= */}

                        {showSuggestions &&
                            searchResults.length > 0 && (

                            <div className="absolute z-50 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">

                                {searchResults.map((product) => (

                                    <div
                                        key={product.id}
                                        onClick={() =>
                                            handleSelectProduct(product)
                                        }
                                        className="p-3 hover:bg-blue-100 cursor-pointer border-b"
                                    >

                                        <div className="font-semibold">
                                            {product.name}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            Barcode: {product.barcode}
                                        </div>

                                    </div>

                                ))}

                            </div>
                        )}

                    </div>

                    {/* =========================
                        BARCODE
                    ========================= */}

                    <input
                        ref={barcodeRef}
                        type="text"
                        placeholder="Barcode"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    {/* =========================
                        QUANTITY
                    ========================= */}

                    <input
                        id="quantityInput"
                        type="number"
                        placeholder="Quantity to Add"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min="1"
                    />

                    {/* =========================
                        BUTTON
                    ========================= */}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                            loading
                                ? "bg-blue-300"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >

                        {loading ? "Processing..." : "Restock"}

                    </button>

                </form>

                {/* =========================
                    BACK BUTTON
                ========================= */}

                <div className="mt-6">

                    <button
                        onClick={() => navigate("/Dashboard")}
                        className="w-full bg-gray-800 hover:bg-black text-white py-3 rounded-lg transition"
                    >
                        ← Back to Dashboard
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Restock;