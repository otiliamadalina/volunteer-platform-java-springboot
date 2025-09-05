import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";


export default function RegisterAsOrg() {

    const navigate = useNavigate();


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

            <div className="button-row">
                <button className="go-back-btn" onClick={() => navigate(-1)}>← Go Back</button>
                <div className="center-button">
                    <button type="submit" className="btn-register-org">Register</button>
                </div>
            </div>


        </div>
    );
}
