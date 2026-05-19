import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StockView() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    // =========================
    // SEARCH STATES
    // =========================
    const [barcode, setBarcode] = useState("");
    const [productName, setProductName] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [singleProduct, setSingleProduct] = useState(null);

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
    // LOAD ALL STOCK
    // =========================
    const loadAllStock = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:8080/api/products",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setProducts(res.data);

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to load stock"
            );
        }
    };

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
    const handleSelectProduct = async (product) => {

        setProductName(product.name);
        setBarcode(product.barcode);

        setSearchResults([]);
        setShowSuggestions(false);

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(
                `http://localhost:8080/api/products/barcode/${product.barcode}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSingleProduct(res.data.data);

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Product not found"
            );

            setSingleProduct(null);
        }

        // RETURN FOCUS TO BARCODE
        barcodeRef.current?.focus();
    };

    // =========================
    // SEARCH BY BARCODE
    // =========================
    const searchByBarcode = async () => {

        if (!barcode) return;

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(
                `http://localhost:8080/api/products/barcode/${barcode}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSingleProduct(res.data.data);

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Product not found"
            );

            setSingleProduct(null);
        }

        // RETURN FOCUS TO BARCODE
        barcodeRef.current?.focus();
    };

    useEffect(() => {
        loadAllStock();
    }, []);

    // =========================
    // SORT PRODUCTS A → Z
    // =========================
    const sortedProducts = [...products].sort(
        (a, b) => a.name.localeCompare(b.name)
    );

    return (

        <div className="p-10 min-h-screen flex flex-col bg-gray-100">

            <h2 className="text-2xl font-bold mb-6">
                Stock Inventory
            </h2>

            {/* =========================
                LOW STOCK ALERT
            ========================= */}

            {products.some(p => p.quantity < 10) && (

                <div className="bg-red-600 text-white p-3 mb-4 rounded">

                    ⚠️ Warning: Some products are LOW in stock (below 10 units)

                </div>
            )}

            {/* =========================
                SEARCH SECTION
            ========================= */}

            <div className="flex flex-wrap gap-2 mb-6">

                {/* PRODUCT NAME SEARCH */}

                <div className="relative">

                    <input
                        type="text"
                        placeholder="Search Product Name"
                        value={productName}
                        onChange={(e) =>
                            handleSearchProduct(e.target.value)
                        }
                        className="border p-2 w-72 rounded"
                    />

                    {/* SEARCH SUGGESTIONS */}

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

                {/* BARCODE INPUT */}

                <input
                    ref={barcodeRef}
                    type="text"
                    placeholder="Enter Barcode"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="border p-2 w-64 rounded"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            searchByBarcode();
                        }
                    }}
                />

                {/* SEARCH BUTTON */}

                <button
                    onClick={searchByBarcode}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Search
                </button>

                {/* REFRESH BUTTON */}

                <button
                    onClick={loadAllStock}
                    className="bg-gray-700 hover:bg-black text-white px-4 py-2 rounded"
                >
                    Refresh
                </button>

            </div>

            {/* =========================
                SINGLE PRODUCT RESULT
            ========================= */}

            {singleProduct && (

                <div className="border p-4 mb-6 bg-yellow-50 rounded shadow">

                    <h3 className="font-bold mb-2 text-lg">
                        Search Result
                    </h3>

                    <p>
                        <strong>Name:</strong> {singleProduct.name}
                    </p>

                    <p>
                        <strong>Barcode:</strong> {singleProduct.barcode || "-"}
                    </p>

                    <p>
                        <strong>Internal Code:</strong> {singleProduct.internalCode || "-"}
                    </p>

                    <p>
                        <strong>Price:</strong> KES {singleProduct.price}
                    </p>

                    <p>
                        <strong>Quantity:</strong> {singleProduct.quantity}
                    </p>

                    <p>
                        <strong>Category:</strong> {singleProduct.category || "-"}
                    </p>

                </div>
            )}

            {/* =========================
                STOCK TABLE
            ========================= */}

            <div className="overflow-x-auto bg-white rounded shadow">

                <table className="w-full border-collapse">

                    <thead>

                        <tr className="bg-gray-200">

                            <th className="border p-2 text-left">
                                Name
                            </th>

                            <th className="border p-2 text-left">
                                Barcode
                            </th>

                            <th className="border p-2 text-left">
                                Internal Code
                            </th>

                            <th className="border p-2 text-left">
                                Price
                            </th>

                            <th className="border p-2 text-left">
                                Quantity
                            </th>

                            <th className="border p-2 text-left">
                                Category
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {sortedProducts.map((p) => {

                            const isLowStock = p.quantity < 10;

                            return (

                                <tr
                                    key={p.id}
                                    className={isLowStock ? "bg-red-50" : ""}
                                >

                                    {/* NAME */}

                                    <td className="border p-2 flex items-center gap-2">

                                        {isLowStock && (
                                            <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                                        )}

                                        {p.name}

                                    </td>

                                    {/* BARCODE */}

                                    <td className="border p-2">
                                        {p.barcode || "-"}
                                    </td>

                                    {/* INTERNAL CODE */}

                                    <td className="border p-2">
                                        {p.internalCode || "-"}
                                    </td>

                                    {/* PRICE */}

                                    <td className="border p-2">
                                        KES {p.price}
                                    </td>

                                    {/* QUANTITY */}

                                    <td className="border p-2">

                                        {isLowStock ? (
                                            <span className="text-red-600 font-bold">
                                                {p.quantity} (LOW)
                                            </span>
                                        ) : (
                                            p.quantity
                                        )}

                                    </td>

                                    {/* CATEGORY */}

                                    <td className="border p-2">
                                        {p.category || "-"}
                                    </td>

                                </tr>

                            );
                        })}

                    </tbody>

                </table>

            </div>

            {/* =========================
                BACK BUTTON
            ========================= */}

            <div className="mt-auto pt-10 flex justify-center">

                <button
                    onClick={() => navigate("/Dashboard")}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow"
                >
                    ⬅ Back to Dashboard
                </button>

            </div>

        </div>
    );
}

export default StockView;