import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword() {

    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleReset = async (e) => {

        e.preventDefault();
        setMessage("");

        // =========================
        // FRONTEND VALIDATION
        // =========================
        if (newPassword !== confirmPassword) {
            setMessage("❌ New passwords do not match");
            return;
        }

        if (!localStorage.getItem("token")) {
            setMessage("❌ You are not logged in");
            navigate("/login");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                }
            );

            const data = await response.text();

            // =========================
            // HANDLE BACKEND RESPONSE
            // =========================
            if (!response.ok) {
                setMessage("❌ " + data);
                return;
            }

            // success check (backend message safety)
            if (data.toLowerCase().includes("successfully")) {

                setMessage("✅ " + data);

                // FORCE LOGOUT AFTER SUCCESS
                setTimeout(() => {

                    localStorage.removeItem("token");
                    localStorage.removeItem("role");

                    navigate("/login");

                }, 1500);

            } else {
                setMessage("❌ " + data);
            }

        } catch (error) {
            setMessage("❌ Server error. Try again.");
        }
    };

    return (

        <div className="h-screen flex items-center justify-center bg-gray-100">

            <form
                onSubmit={handleReset}
                className="bg-white p-8 rounded-xl shadow-md w-96"
            >

                <h1 className="text-2xl font-bold mb-6 text-center">
                    🔐 Reset Password
                </h1>

                {/* CURRENT PASSWORD */}
                <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border p-3 rounded mb-4"
                    required
                />

                {/* NEW PASSWORD */}
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border p-3 rounded mb-4"
                    required
                />

                {/* CONFIRM PASSWORD */}
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border p-3 rounded mb-4"
                    required
                />

                {/* SUBMIT */}
                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded transition"
                >
                    Reset Password
                </button>

                {/* MESSAGE */}
                {message && (
                    <p className="text-center mt-4 font-medium">
                        {message}
                    </p>
                )}

                {/* BACK BUTTON */}
                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded"
                >
                    ← Back to Dashboard
                </button>

            </form>

        </div>
    );
}

export default ResetPassword;