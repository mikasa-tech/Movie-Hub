import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../Register/Register.css";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/login", formData);
            if (response.data.message === "Login successful") {
                // Redirection to the specific Netflix landing page URL as requested
                window.location.href = "https://movie-hub-c37o-3pygy5sm7-mikasa-techs-projects.vercel.app";
            }
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="auth_container">
            <div className="auth_box">
                <h1>Sign In</h1>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
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
                    <button type="submit">Sign In</button>
                </form>
                <p>
                    New to Netflix? <Link to="/register">Sign Up now.</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
