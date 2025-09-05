import React from "react";
import "../../styles/auth.css";

export default function RegisterAsOrg() {
    return (
        <div className="register-org-container">
            <h2 className="register-title">Register Your Organization</h2>
            <p className="register-subtitle">Connect with volunteers and grow your impact</p>

            <form className="register-org-form">
                <div className="form-column">
                    <input type="text" className="form-input" placeholder="Organization Full Name" required />
                    <input type="email" className="form-input" placeholder="Contact Email" required />
                    <input type="text" className="form-input" placeholder="Contact Number" required />
                </div>

                <div className="form-column">
                    <input type="text" className="form-input" placeholder="Location" required />
                    <input type="password" className="form-input" placeholder="Create Password" required />
                    <input type="password" className="form-input" placeholder="Confirm Password" required />
                </div>
            </form>

            <button type="submit" className="btn-register-org">Register</button>
        </div>
    );
}
