import React from "react";
import { Link } from "react-router-dom";
import "../../styles/auth.css";
import "../../styles/navbar.css"

export default function VolunteerOrOrg() {
    return (
        <div className="container volunteer-org-choice">
            <h2 className="choice-title">Choose your path</h2>
            <div className="choice-buttons">
                <Link to="/register-volunteer" className="btn nav-btn-login me-2">Register as Volunteer</Link>
                <Link to="/register-org" className="btn nav-btn-register me-2">Register as Organization</Link>
            </div>
        </div>

    );
}
