import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/auth.css";

export default function RegisterAsVolunteer() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [location, setLocation] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:8080/api/registerAsVolunteer", {
                fullName,
                email,
                password,
                location,
            });
            alert("Registration Successfully!");
            navigate("/volunteerDashboard");
        } catch (error) {
            console.error("ERROR:", error);
            alert("Error occured. Try again.");
        }
    };

    return (
        <div className="register-container">
            <button className="go-back-top-left" onClick={() => navigate(-1)}>← Go Back</button>

            <h2 className="register-title">Become a Volunteer</h2>
            <p className="register-subtitle">Fill in your details to join our community</p>

            <form className="register-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    className="form-input"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    className="form-input"
                    placeholder="Create Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    className="form-input"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                <button type="submit" className="btn-register-volunteer">Register</button>
            </form>
        </div>
    );
}
