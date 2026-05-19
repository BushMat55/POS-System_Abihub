import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UpdatePrice() {

    const navigate = useNavigate();

    const [barcode, setBarcode] = useState("");
    const [price, setPrice] = useState("");

    // =========================
    // SEARCH STATES
    // =========================
    const [productName, setProductName] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // =========================
    // BARCODE INPUT REF
    // =========================
    const barcodeRef = useRef(null);

    // =========================
    // AUTOFOCUS BARCODE
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

        // RETURN FOCUS TO BARCODE
        barcodeRef.current?.focus();
    };

    // =========================
    // BACK TO DASHBOARD
    // =========================
    const goToDashboard = () => {

        const role = localStorage.getItem("role");

        if (role === "MANAGER") {
            navigate("/Dashboard");
        } else {
            navigate("/Dashboard");
        }
    };

    // =========================
    // UPDATE PRICE
    // =========================
    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:8080/api/products/update-price/${barcode}?price=${price}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("✅ Price updated successfully");

            // RESET
            setBarcode("");
            setPrice("");
            setProductName("");
            setSearchResults([]);
            setShowSuggestions(false);

            // RETURN FOCUS
            barcodeRef.current?.focus();

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to update price";

            alert("❌ " + message);
        }
    };

    return (

        <div className="p-10 bg-gray-50 min-h-screen flex justify-center">

            <div className="w-full max-w-md">

                <h2 className="text-2xl font-bold mb-6">
                    Update Product Price
                </h2>

                {/* =========================
                    FORM
                ========================= */}

                <form
                    onSubmit={handleUpdate}
                    className="space-y-4 bg-white p-6 rounded shadow"
                >

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
                            className="w-full p-3 border rounded"
                        />

                        {/* SEARCH RESULTS */}

                        {showSuggestions &&
                            searchResults.length > 0 && (

                            <div className="absolute z-50 bg-white border rounded shadow-lg w-full max-h-60 overflow-y-auto">

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
                        BARCODE INPUT
                    ========================= */}

                    <input
                        ref={barcodeRef}
                        type="text"
                        placeholder="Barcode"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        className="w-full p-3 border rounded"
                        required
                    />

                    {/* =========================
                        PRICE INPUT
                    ========================= */}

                    <input
                        type="number"
                        placeholder="New Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-3 border rounded"
                        required
                    />

                    {/* =========================
                        UPDATE BUTTON
                    ========================= */}

                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded w-full"
                    >
                        Update Price
                    </button>

                    {/* =========================
                        BACK BUTTON
                    ========================= */}

                    <button
                        type="button"
                        onClick={goToDashboard}
                        className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-3 rounded w-full"
                    >
                        ⬅ Back to Dashboard
                    </button>

                </form>

            </div>

        </div>
    );
}

export default UpdatePrice;