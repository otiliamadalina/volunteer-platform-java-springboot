import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {

    const navigate = useNavigate();

    {/* stare - retine informatii care se pot schimba in timp, in functie de ce face utilizatorul */ }
    {/* am creat o stare deoarece vrem sa retinem datele introduse la login */ }

    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    // ia valorile din obiect si le pune in variabile separate
    const { email, password } = credentials;

    // functie care se apeleaza cand utilizatorul modifica un input
    const onInputChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    // functie care se apeleaza la submit
    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        console.log("Login form submitted");

        try {
            const res = await axios.post("http://localhost:8080/api/login", {
                email,
                password
            });

            const {role, id} = res.data;

            localStorage.setItem("userId", id);
            localStorage.setItem("role", role);

            // redirectionare in functie de rol
            if (role === "volunteer") {
                navigate("/volunteerDashboard");
            } else if (role === "organisation") {
                navigate("/organisationDashboard");
            } else {
                navigate("/unknownRole"); //  rol necunoscut
            }

        } catch (err) {
            console.error("Login error:", err);
            if (err.response) {
                setError(err.response.data);
            } else {
                setError("Unexpected error. Please try again.");
            }
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Log in to continue your journey</p>

            <form className="login-form" onSubmit={(e) => onSubmit(e)}>
                <input
                    type="email"
                    className="form-input"
                    placeholder="Email address"
                    name="email"
                    value={email}
                    onChange={(e) => onInputChange(e)}
                    required
                />
                <input
                    type="password"
                    className="form-input"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(e) => onInputChange(e)}
                    required
                />
                {error && <p className="error-text">{error}</p>}
                <button type="submit" className="btn-login">Log In</button>
            </form>

            <div className="login-footer">
                <span>Don't have an account?</span>
                <Link to="/volunteerOrOrg" className="link-register">Register here</Link>
            </div>
        </div>
    );
}
