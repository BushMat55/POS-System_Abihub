import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateUser() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("CASHIER");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("You must be logged in as MANAGER");
                return;
            }

            const response = await axios.post(
                "http://localhost:8080/api/users/create",
                {
                    username,
                    password,
                    role
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(response.data);
            setUsername("");
            setPassword("");
            setRole("CASHIER");

        } catch (err) {

            if (err.response) {
                setError(err.response.data || "Error creating user");
            } else {
                setError("Server not reachable");
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2>Create User</h2>

            <form onSubmit={handleSubmit} style={styles.form}>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={styles.input}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={styles.input}
                >
                    <option value="CASHIER">CASHIER</option>
                    <option value="MANAGER">MANAGER</option>
                </select>

                <button type="submit" style={styles.button}>
                    Create User
                </button>
            </form>

            {message && <p style={styles.success}>{message}</p>}
            {error && <p style={styles.error}>{error}</p>}

            {/* 🔽 BACK BUTTON AT BOTTOM */}
            <button
                onClick={() => navigate("/dashboard")}
                style={styles.backButton}
            >
                ← Back to Dashboard
            </button>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },
    input: {
        padding: "10px",
        fontSize: "16px"
    },
    button: {
        padding: "10px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        cursor: "pointer"
    },
    backButton: {
        marginTop: "20px",
        padding: "10px",
        backgroundColor: "#6c757d",
        color: "white",
        border: "none",
        cursor: "pointer",
        width: "100%"
    },
    success: {
        color: "green",
        marginTop: "10px"
    },
    error: {
        color: "red",
        marginTop: "10px"
    }
};

export default CreateUser;