import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddProduct() {

    const navigate = useNavigate();

    const barcodeRef = useRef(null);
    const nameRef = useRef(null);
    const priceRef = useRef(null);

    const [product, setProduct] = useState({
        name: "",
        barcode: "",
        price: "",
        quantity: "",
        category: ""
    });

    // =========================
    // AUTO FOCUS BARCODE
    // =========================
    useEffect(() => {
        barcodeRef.current.focus();
    }, []);

    // =========================
    // HANDLE INPUT CHANGE
    // =========================
    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    // =========================
    // CHECK BARCODE EXISTS
    // =========================
    const checkBarcodeExists = async (barcode) => {

        if (!barcode.trim()) return true;

        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                `http://localhost:8080/api/products/${barcode}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // ✅ FOUND → SHOW ERROR
            alert(`⚠️ Barcode already exists!\nProduct: ${res.data.name}`);

            setProduct(prev => ({
                ...prev,
                barcode: ""
            }));

            barcodeRef.current.focus();

            return true;

        } catch (error) {

            // ✅ NOT FOUND → SAFE
            if (error.response && error.response.status === 404) {
                return false;
            }
        }
    };

    // =========================
    // ENTER NAVIGATION
    // =========================
    const handleKeyDown = (e, nextRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    // =========================
    // SUBMIT PRODUCT
    // =========================
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            const response = await axios.post(
                "http://localhost:8080/api/products",
                product,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // ✅ SUCCESS
            alert("✅ " + (response.data.message || "Product added successfully"));

            // RESET FORM
            setProduct({
                name: "",
                barcode: "",
                price: "",
                quantity: "",
                category: ""
            });

            barcodeRef.current.focus();

        } catch (error) {

            console.log("FULL ERROR:", error);

            let message = "Error adding product";

            if (error.response) {

                // =========================
                // SPRING BOOT RESPONSE
                // =========================
                const data = error.response.data;

                console.log("SERVER DATA:", data);

                // If backend returns plain string
                if (typeof data === "string") {
                    message = data;
                }

                // Spring Boot ResponseStatusException structure
                else if (data.message) {
                    message = data.message;
                }

                // Some Spring versions use 'error'
                else if (data.error) {
                    message = data.error;
                }

                // Some versions put it in detail
                else if (data.detail) {
                    message = data.detail;
                }

                // Fallback by status code
                else if (error.response.status === 403) {
                    message = "Access denied";
                }

                else if (error.response.status === 400) {
                    message = "Invalid request";
                }
            }

            // Network error
            else if (error.message) {
                message = error.message;
            }

            alert("❌Barcode or the product already exists please restock" + message);
        }
    };

    return (

        <div className="min-h-screen bg-gray-100 p-10">

            <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8">

                <h2 className="text-3xl font-bold mb-6 text-gray-800">
                    Add New Products
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* =========================
                        BARCODE INPUT
                    ========================= */}
                    <input
                        ref={barcodeRef}
                        type="text"
                        name="barcode"
                        placeholder="Scan or Enter Barcode"
                        value={product.barcode}
                        onChange={handleChange}
                        onKeyDown={async (e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();

                                const exists = await checkBarcodeExists(product.barcode);

                                if (!exists) {
                                    nameRef.current.focus();
                                }
                            }
                        }}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />

                    {/* PRODUCT NAME */}
                    <input
                        ref={nameRef}
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={product.name}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, priceRef)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />

                    {/* PRICE */}
                    <input
                        ref={priceRef}
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={product.price}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />

                    {/* QUANTITY */}
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={product.quantity}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />

                    {/* CATEGORY */}
                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={product.category}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />

                    {/* SAVE BUTTON */}
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                    >
                        Save Product
                    </button>

                    {/* BACK BUTTON */}
                    <button
                        type="button"
                        onClick={() => navigate("/Dashboard")}
                        className="w-full bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition"
                    >
                        ← Back to Dashboard
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AddProduct;