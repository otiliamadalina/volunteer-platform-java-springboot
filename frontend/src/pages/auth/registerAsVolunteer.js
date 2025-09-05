import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";

export default function RegisterAsVolunteer() {
    const navigate = useNavigate();

    return (
        <div className="register-container">
            <button className="go-back-top-left" onClick={() => navigate(-1)}>← Go Back</button>

            <h2 className="register-title">Become a Volunteer</h2>
            <p className="register-subtitle">Fill in your details to join our community</p>

            <form className="register-form">
                <input type="text" className="form-input" placeholder="Full Name" required />
                <input type="email" className="form-input" placeholder="Email Address" required />
                <input type="text" className="form-input" placeholder="Create Password" required />
                <input type="password" className="form-input" placeholder="Confirm Password" required />
                <button type="submit" className="btn-register-volunteer">Register</button>
            </form>
        </div>
    );
}
