import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        // CLEAR OLD MESSAGE
        setMessage("");

        try {

            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            // 🔥 HANDLE SUCCESS
            if (response.ok && data.token) {

                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);

                navigate("/dashboard");

            } else {

                // 🔥 HANDLE BACKEND ERRORS PROPERLY
                if (data.message === "User not found") {
                    setMessage("User does not exist");
                } else if (data.message === "Invalid password") {
                    setMessage("Incorrect password");
                } else {
                    setMessage("Invalid username or password");
                }
            }

        } catch (error) {

            setMessage("Server error. Try again.");

        }
    };

    return (

        <div className="h-screen flex items-center justify-center bg-gray-100">

            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-xl shadow-md w-96"
            >

                <h1 className="text-3xl font-bold mb-6 text-center">
                    POS Login
                </h1>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border p-3 rounded mb-4"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-3 rounded mb-4"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded transition"
                >
                    Login
                </button>

                {/* 🔥 ERROR MESSAGE */}
                {message && (
                    <p className="text-red-500 text-center mt-4">
                        {message}
                    </p>
                )}

                {/* 🔽 BACK TO LANDING PAGE */}
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded transition"
                >
                    ← Back to Landing Page
                </button>

            </form>

        </div>
    );
}

export default Login;