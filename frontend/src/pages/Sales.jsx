import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Sales() {

    const navigate = useNavigate();

    const [barcode, setBarcode] = useState("");
    const [cart, setCart] = useState([]);

    // PAYMENT STATES
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [amountGiven, setAmountGiven] = useState("");
    const [change, setChange] = useState(0);
    const [loading, setLoading] = useState(false);
    const [nameSearch, setNameSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    useEffect(() => {

        const delay = setTimeout(() => {
            searchByName(nameSearch);
        }, 300);

        return () => clearTimeout(delay);

    }, [nameSearch]);

    const barcodeInputRef = useRef(null);

// GRAND TOTAL
    const grandTotal = cart.reduce(
        (sum, item) => sum + item.subtotal,
        0
    );


    // AUTO FOCUS INPUT
    useEffect(() => {
        barcodeInputRef.current.focus();
    }, []);

useEffect(() => {

    if (paymentMethod === "CASH") {

        const given = Number(amountGiven || 0);

        const calculatedChange = given - grandTotal;

        setChange(calculatedChange > 0
            ? calculatedChange
            : 0
        );

    } else {

        setAmountGiven("");
        setChange(0);

    }

}, [amountGiven, paymentMethod, grandTotal]);


    // FETCH PRODUCT USING BARCODE
    const fetchProductByBarcode = async () => {

        if (!barcode.trim()) return;

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:8080/api/products/barcode/${barcode}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const product = response.data.data;

            // CHECK STOCK BEFORE CART
            if (product.quantity <= 0) {

                alert(`${product.name} is out of stock`);

                setBarcode("");

                barcodeInputRef.current.focus();

                return;
            }

            addToCart(product);

            setBarcode("");

            barcodeInputRef.current.focus();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Product not found"
            );

            setBarcode("");

            barcodeInputRef.current.focus();
        }
    };

const searchByName = async (keyword) => {

    if (!keyword.trim()) {
        setSearchResults([]);
        setShowResults(false);
        return;
    }

    try {

        setSearchLoading(true);

        const token = localStorage.getItem("token");

        const response = await axios.get(
            `http://localhost:8080/api/products/search-by-name?keyword=${keyword}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setSearchResults(response.data.data);
        setShowResults(true);

    } catch (error) {

        setSearchResults([]);
        setShowResults(false);

    } finally {
        setSearchLoading(false);
    }
};

const selectProductFromSearch = (product) => {

    // stock check
    if (product.quantity <= 0) {
        alert("Product is out of stock");
        return;
    }

    addToCart(product);

    setNameSearch("");
    setSearchResults([]);
    setShowResults(false);

    barcodeInputRef.current.focus();
};

    // ADD PRODUCT TO CART
    const addToCart = (product) => {

        setCart((prevCart) => {

            const existingItem = prevCart.find(
                (item) => item.barcode === product.barcode
            );

            // PRODUCT ALREADY IN CART
            if (existingItem) {

                // BLOCK EXCEEDING STOCK
                if (existingItem.quantity >= product.quantity) {

                    alert(
                        `Only ${product.quantity} item(s) available for ${product.name}`
                    );

                    return prevCart;
                }

                return prevCart.map((item) => {

                    if (item.barcode === product.barcode) {

                        const newQuantity = item.quantity + 1;

                        return {
                            ...item,
                            quantity: newQuantity,
                            subtotal: newQuantity * item.price
                        };
                    }

                    return item;
                });
            }

            // NEW PRODUCT
            const newItem = {

                cartId: prevCart.length + 1,

                barcode: product.barcode,

                productName: product.name,

                price: product.price,

                stockQuantity: product.quantity,

                quantity: 1,

                subtotal: product.price
            };

            return [...prevCart, newItem];
        });
    };

    // INCREASE QUANTITY
    const increaseQuantity = (barcode) => {

        setCart((prevCart) =>
            prevCart.map((item) => {

                if (item.barcode === barcode) {

                    if (item.quantity >= item.stockQuantity) {
                        alert("Cannot exceed available stock");
                        return item;
                    }

                    const newQuantity = item.quantity + 1;

                    return {
                        ...item,
                        quantity: newQuantity,
                        subtotal: newQuantity * item.price
                    };
                }

                return item;
            })
        );
    };

    // DECREASE QUANTITY
    const decreaseQuantity = (barcode) => {

        setCart((prevCart) =>
            prevCart
                .map((item) => {

                    if (item.barcode === barcode) {

                        const newQuantity = item.quantity - 1;

                        return {
                            ...item,
                            quantity: newQuantity,
                            subtotal: newQuantity * item.price
                        };
                    }

                    return item;
                })
                .filter((item) => item.quantity > 0)
        );
    };

    // REMOVE ITEM
    const removeItem = (barcode) => {

        const updatedCart = cart.filter(
            (item) => item.barcode !== barcode
        );

        const rearranged = updatedCart.map((item, index) => ({
            ...item,
            cartId: index + 1
        }));

        setCart(rearranged);
    };

    // CLEAR CART
    const clearCart = () => {
        setCart([]);
    };


    // OPEN PAYMENT MODAL
    const handlePay = () => {

        if (cart.length === 0) {
            alert("Cart is empty");
            return;
        }

        setShowPaymentModal(true);
    };

   // GENERATE RECEIPT HTML
   const generateReceipt = () => {

       // GET JWT TOKEN
       const token = localStorage.getItem("token");

       let servedBy = "Cashier";

       // DECODE JWT TOKEN
       if (token) {

           try {

               const payload = JSON.parse(
                   atob(token.split(".")[1])
               );

               servedBy =
                   payload.fullName ||
                   payload.sub ||
                   "Cashier";

           } catch (error) {

               console.log("Failed to decode token");

           }
       }

       // UNIQUE RECEIPT NUMBER
       const receiptNo =
           "TEL-" +
           Date.now() +
           "-" +
           Math.floor(Math.random() * 10000);

       // CURRENT DATE & TIME
       const currentDate =
           new Date().toLocaleString();

       // VAT RATE
       const VAT_RATE = 16;

       // TAXABLE AMOUNT
       const taxableAmount =
           grandTotal / 1.16;

       // VAT TAX
       const tax =
           grandTotal - taxableAmount;

       // COUNT ITEMS
       const totalItems = cart.reduce(
           (sum, item) => sum + item.quantity,
           0
       );

       return `
           <html>

           <head>

               <title>Receipt</title>

               <style>

                   body{
                       font-family: Arial, sans-serif;
                       padding: 10px;
                       width: 320px;
                   }

                   .center{
                       text-align:center;
                   }

                   h2{
                       margin:0;
                       font-size:20px;
                   }

                   p{
                       margin:4px 0;
                       font-size:12px;
                   }

                   table{
                       width:100%;
                       border-collapse:collapse;
                       margin-top:10px;
                   }

                   th{
                       border-bottom:1px solid #000;
                       padding:4px;
                       font-size:11px;
                       text-align:left;
                   }

                   td{
                       padding:4px;
                       font-size:11px;
                   }

                   .summary{
                       margin-top:10px;
                   }

                   .summary td{
                       padding:3px;
                       font-size:12px;
                   }

                   hr{
                       border:none;
                       border-top:1px dashed #000;
                       margin:10px 0;
                   }

                   .footer{
                       text-align:center;
                       margin-top:15px;
                       font-size:12px;
                   }

               </style>

           </head>

           <body>

               <div class="center">

                   <h2>
                       TEL AVIV MINI SUPERMARKET
                   </h2>

                   <p>
                       Embu, Kenya
                   </p>

                   <p>
                       Tel: 0718653123
                   </p>

               </div>

               <hr />

               <p>
                   Receipt No:
                   <b>${receiptNo}</b>
               </p>

               <p>
                   Served By:
                   <b>${servedBy}</b>
               </p>

               <p>
                   Date & Time:
                   <b>${currentDate}</b>
               </p>

             <p>
                 Payment Method:
                 <b>${paymentMethod}</b>
             </p>

             ${paymentMethod === "CASH" ? `

             <p>
                 Amount Given:
                 <b>KES ${Number(amountGiven).toFixed(2)}</b>
             </p>

             <p>
                 Change:
                 <b>KES ${change.toFixed(2)}</b>
             </p>

             ` : ""}

               <hr />

               <table>

                   <thead>

                       <tr>
                           <th>Item</th>
                           <th>Qty</th>
                           <th>Price</th>
                           <th>Amount</th>
                       </tr>

                   </thead>

                   <tbody>

                       ${cart.map(item => `

                           <tr>

                               <td>
                                   ${item.productName}
                               </td>

                               <td>
                                   ${item.quantity}
                               </td>

                               <td>
                                   ${item.price.toFixed(2)}
                               </td>

                               <td>
                                   ${item.subtotal.toFixed(2)}
                               </td>

                           </tr>

                       `).join("")}

                   </tbody>

               </table>

               <hr />

               <table class="summary">

                   <tr>
                       <td>
                           Subtotal:
                       </td>

                       <td style="text-align:right;">
                           KES ${taxableAmount.toFixed(2)}
                       </td>
                   </tr>

                   <tr>
                       <td>
                           VAT (${VAT_RATE}%):
                       </td>

                       <td style="text-align:right;">
                           KES ${tax.toFixed(2)}
                       </td>
                   </tr>

                   <tr>
                       <td>
                           TOTAL:
                       </td>

                       <td style="text-align:right; font-weight:bold;">
                           KES ${grandTotal.toFixed(2)}
                       </td>
                   </tr>

               </table>

               <hr />

               <table class="summary">

                   <thead>

                       <tr>

                           <th>
                               Code
                           </th>

                           <th>
                               Rate
                           </th>

                           <th>
                               Count
                           </th>

                           <th>
                               Taxable Amt
                           </th>

                           <th>
                               Tax
                           </th>

                       </tr>

                   </thead>

                   <tbody>

                       <tr>

                           <td>
                               S
                           </td>

                           <td>
                               ${VAT_RATE}%
                           </td>

                           <td>
                               ${totalItems}
                           </td>

                           <td>
                               ${taxableAmount.toFixed(2)}
                           </td>

                           <td>
                               ${tax.toFixed(2)}
                           </td>

                       </tr>

                   </tbody>

               </table>

               <hr />

               <div class="footer">

                   <p>
                       Thank You For Shopping With Us
                   </p>

                   <p>
                       Welcome Again
                   </p>

               </div>

               <script>

                   window.onload = function() {

                       window.print();

                       window.onafterprint = function() {
                           window.close();
                       };

                   };

               </script>

           </body>

           </html>
       `;
   };

    // PRINT RECEIPT
    const printReceipt = () => {

        const receiptWindow = window.open(
            "",
            "PRINT",
            "width=400,height=600"
        );

        receiptWindow.document.write(
            generateReceipt()
        );

        receiptWindow.document.close();
    };

    // CONFIRM PAYMENT
    const confirmPayment = async () => {

        try {

            setLoading(true);

            const payload = {

                totalAmount: grandTotal,

                paymentMethod: paymentMethod,

                amountGiven:
                    paymentMethod === "CASH"
                        ? Number(amountGiven)
                        : 0,

                changeAmount:
                    paymentMethod === "CASH"
                        ? change
                        : 0,

                items: cart.map(item => ({
                    barcode: item.barcode,
                    productName: item.productName,
                    price: item.price,
                    quantity: item.quantity,
                    subtotal: item.subtotal
                }))
            };

            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:8080/api/sales/checkout",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Payment successful");

            // PRINT RECEIPT
            printReceipt();

            // RESET STATES
            setCart([]);
            setShowPaymentModal(false);
            setPaymentMethod("CASH");

            setAmountGiven("");
            setChange(0);

            barcodeInputRef.current.focus();

        } catch (error) {

            const msg =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Checkout failed";

            alert(msg);

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="p-6 bg-gray-100 min-h-screen">

            <div className="bg-white shadow-lg rounded-lg p-6">

                <h1 className="text-3xl font-bold mb-6">
                    Supermarket POS
                </h1>

                {/* SEARCH SECTION */}
                <div className="flex gap-3 mb-6">

                    {/* BARCODE INPUT */}
                    <div className="w-1/2 relative">

                        <input
                            ref={barcodeInputRef}
                            type="text"
                            value={barcode}
                            placeholder="Scan barcode..."
                            onChange={(e) => setBarcode(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    fetchProductByBarcode();
                                }
                            }}
                            className="border w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            onClick={fetchProductByBarcode}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg mt-2 w-full"
                        >
                            Add by Barcode
                        </button>

                    </div>

                    {/* NAME SEARCH INPUT */}
                    <div className="w-1/2 relative">

                        <input
                            type="text"
                            value={nameSearch}
                            placeholder="Search product by name..."
                            onChange={(e) => setNameSearch(e.target.value)}
                            className="border w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        {/* DROPDOWN RESULTS */}
                        {showResults && searchResults.length > 0 && (

                            <div className="absolute z-50 bg-white border w-full mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto">

           {searchResults.map((product) => (

               <div
                   key={product.barcode}
                   onClick={() => selectProductFromSearch(product)}
                   className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between"
               >

                   {/* PRODUCT NAME */}
                   <span>
                       {product.name}
                   </span>

                   {/* PRICE */}
                   <span className="text-gray-600 font-semibold">
                       KES {product.price}
                   </span>

               </div>

           ))}

                            </div>

                        )}

                    </div>

                </div>

                {/* CART TABLE */}
                <div className="overflow-x-auto">

                    <table className="w-full border-collapse">

                        <thead>

                            <tr className="bg-gray-200">

                                <th className="border p-3">#</th>
                                <th className="border p-3">Barcode</th>
                                <th className="border p-3">Product</th>
                                <th className="border p-3">Price</th>
                                <th className="border p-3">Qty</th>
                                <th className="border p-3">Subtotal</th>
                                <th className="border p-3">Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {cart.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="border p-5 text-center"
                                    >
                                        No items in cart
                                    </td>

                                </tr>

                            ) : (

                                cart.map((item) => (

                                    <tr key={item.cartId}>

                                        <td className="border p-3 text-center">
                                            {item.cartId}
                                        </td>

                                        <td className="border p-3">
                                            {item.barcode}
                                        </td>

                                        <td className="border p-3">
                                            {item.productName}
                                        </td>

                                        <td className="border p-3">
                                            KES {item.price}
                                        </td>

                                        <td className="border p-3">

                                            <div className="flex justify-center items-center gap-2">

                                                <button
                                                    onClick={() =>
                                                        decreaseQuantity(item.barcode)
                                                    }
                                                    className="bg-gray-300 px-3 rounded"
                                                >
                                                    -
                                                </button>

                                                <span>
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        increaseQuantity(item.barcode)
                                                    }
                                                    className="bg-gray-300 px-3 rounded"
                                                >
                                                    +
                                                </button>

                                            </div>

                                        </td>

                                        <td className="border p-3">
                                            KES {item.subtotal}
                                        </td>

                                        <td className="border p-3 text-center">

                                            <button
                                                onClick={() =>
                                                    removeItem(item.barcode)
                                                }
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                                            >
                                                Remove
                                            </button>

                                        </td>

                                    </tr>
                                ))
                            )}

                        </tbody>

                    </table>

                </div>

                {/* TOTAL SECTION */}
                <div className="mt-8 flex justify-between items-center">

                    <div className="text-3xl font-bold">
                        Total: KES {grandTotal}
                    </div>

                    <div className="flex gap-3">

                        <button
                            onClick={clearCart}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
                        >
                            Clear Cart
                        </button>

                        <button
                            onClick={handlePay}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold"
                        >
                            Pay
                        </button>

                    </div>

                </div>

                {/* BACK BUTTON */}
                <div className="mt-6">

                    <button
                        onClick={() => navigate("/Dashboard")}
                        className="bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-lg"
                    >
                        ← Back to Dashboard
                    </button>

                </div>

            </div>

            {/* PAYMENT MODAL */}
            {showPaymentModal && (

                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

                    <div className="bg-white rounded-lg p-8 w-[400px] shadow-xl">

                        <h2 className="text-2xl font-bold mb-6">
                            Confirm Payment
                        </h2>

                        {/* PAYMENT METHOD */}
                        <div className="mb-4">

                            <label className="block mb-2 font-semibold">
                                Payment Method
                            </label>

                            <select
                                value={paymentMethod}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                                className="w-full border p-3 rounded-lg"
                            >

                                <option value="CASH">
                                    CASH
                                </option>

                                <option value="MPESA">
                                    MPESA
                                </option>

                            </select>

                        </div>

                        {/* TOTAL */}
                        <div className="mb-4 text-xl font-bold">

                            Total Amount:
                            <span className="ml-2 text-green-700">
                                KES {grandTotal.toFixed(2)}
                            </span>

                        </div>

                        {/* CASH SECTION */}
                        {paymentMethod === "CASH" && (

                            <>

                                {/* AMOUNT GIVEN */}
                                <div className="mb-4">

                                    <label className="block mb-2 font-semibold">
                                        Amount Given
                                    </label>

                                    <input
                                        type="number"
                                        value={amountGiven}
                                        onChange={(e) =>
                                            setAmountGiven(e.target.value)
                                        }
                                        placeholder="Enter cash received"
                                        className="w-full border p-3 rounded-lg"
                                    />

                                </div>

                                {/* CHANGE */}
                                <div className="mb-6 text-lg font-bold">

                                    Change:
                                    <span className="ml-2 text-blue-700">
                                        KES {change.toFixed(2)}
                                    </span>

                                </div>

                                {/* INSUFFICIENT MONEY */}
                                {Number(amountGiven) > 0 &&
                                    Number(amountGiven) < grandTotal && (

                                    <div className="mb-4 text-red-600 font-semibold">

                                        Amount given is less than total amount.

                                    </div>

                                )}

                            </>

                        )}

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() =>
                                    setShowPaymentModal(false)
                                }
                                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
                            >
                                Cancel
                            </button>

                                                        <button
                                                            onClick={confirmPayment}
                                                            disabled={
                                                                loading ||
                                                                (
                                                                    paymentMethod === "CASH" &&
                                                                    Number(amountGiven) < grandTotal
                                                                )
                                                            }
                                                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                                                        >

                                                            {loading
                                                                ? "Processing..."
                                                                : "Confirm Payment"}

                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        )}
                                            </div>
                                        );
                                    }
export default Sales;