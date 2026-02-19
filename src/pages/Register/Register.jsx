import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
    const [formData, setFormData] = useState({
        userid: "",
        username: "",
        email: "",
        password: "",
        phone: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/register", formData);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="auth_container">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
            <div className="auth_box">
                <h1>Register</h1>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="userid"
                        placeholder="User ID"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="User Name"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Sign Up</button>
                </form>
                <p>
                    Already have an account? <Link to="/login">Sign In now.</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
