import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterAsOrg() {

    const navigate = useNavigate();

    const [organisation, setOrganisation] = useState({
        fullName: "",
        email: "",
        contactNumber: "",
        location: "",
        password: "",
        confirmPassword: ""
    });

    const { fullName, email, contactNumber, location, password, confirmPassword } = organisation;

    const onInputChange = (e) => {
        setOrganisation({
            ...organisation,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/api/registerAsOrganisation",
                {
                    fullName,
                    email,
                    contactNumber,
                    location,
                    password
                },
                { withCredentials: true }
            );

            if (response.data && response.data.fullName && response.data.role) {
                localStorage.setItem("userName", response.data.fullName);
                localStorage.setItem("role", response.data.role);
                alert("Registration successful!");
                navigate("/");
            } else {
                alert("Registration successful, but login data was not received. Please log in.");
                navigate("/login");
            }

        } catch (error) {
            console.error("Registration error:", error);
            if (error.response && error.response.data) {
                alert("An error occurred during registration: " + error.response.data);
            } else {
                alert("An error occurred. Please try again.");
            }
        }
    };


    return (
        <div className="register-org-container">
            <h2 className="register-title">Register Your Organization</h2>
            <p className="register-subtitle">Connect with volunteers and grow your impact</p>

            <form className="register-org-form" onSubmit={(e) => onSubmit(e)}>
                <div className="form-column">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Organization Full Name"
                        name="fullName"
                        value={fullName}
                        onChange={(e) => onInputChange(e)}
                        required
                    />
                    <input
                        type="email"
                        className="form-input"
                        placeholder="Contact Email"
                        name="email"
                        value={email}
                        onChange={(e) => onInputChange(e)}
                        required
                    />
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Contact Number"
                        name="contactNumber"
                        value={contactNumber}
                        onChange={(e) => onInputChange(e)}
                        required
                    />
                </div>

                <div className="form-column">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Location"
                        name="location"
                        value={location}
                        onChange={(e) => onInputChange(e)}
                        required
                    />
                    <input
                        type="password"
                        className="form-input"
                        placeholder="Create Password"
                        name="password"
                        value={password}
                        onChange={(e) => onInputChange(e)}
                        required
                    />
                    <input
                        type="password"
                        className="form-input"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => onInputChange(e)}
                        required
                    />
                </div>
            </form>

            <div className="button-row">
                <button className="go-back-btn" onClick={() => navigate(-1)}>← Go Back</button>
                <div className="center-button">
                    <button type="submit" className="btn-register-org" onClick={(e) => onSubmit(e)}>Register</button>
                </div>
            </div>
        </div>
    );
}