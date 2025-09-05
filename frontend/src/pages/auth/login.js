import React from "react";
import { Link } from "react-router-dom";
import "../../styles/auth.css";

export default function Login() {
    return (
        <div className="login-container">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Log in to continue your journey</p>

            <form className="login-form">
                <input
                    type="email"
                    className="form-input"
                    placeholder="Email address"
                    required
                />
                <input
                    type="password"
                    className="form-input"
                    placeholder="Password"
                    required
                />
                <button type="submit" className="btn-login">Log In</button>
            </form>

            <div className="login-footer">
                <span>Don't have an account?</span>
                <Link to="/volunteerOrOrg" className="link-register">Register here</Link>
            </div>
        </div>
    );
}
