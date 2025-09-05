import React from "react";
import "../../styles/auth.css";

export default function RegisterAsVolunteer() {
    return (
        <div className="register-container">
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
