import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../Register/Register.css";

function ForgotPassword() {
    const [formData, setFormData] = useState({
        email: "",
        userid: "",
        newPassword: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await axios.post("/api/reset-password", formData);
            setMessage(response.data.message);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Password reset failed");
        }
    };

    return (
        <div className="auth_container">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
            <div className="auth_box">
                <h1>Reset Password</h1>
                {error && <p className="error">{error}</p>}
                {message && <p className="success" style={{ color: '#46d369', textAlign: 'center', marginBottom: '10px' }}>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="userid"
                        placeholder="User ID"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Update Password</button>
                </form>
                <p>
                    Remembered? <Link to="/login">Sign In now.</Link>
                </p>
            </div>
        </div>
    );
}

export default ForgotPassword;
