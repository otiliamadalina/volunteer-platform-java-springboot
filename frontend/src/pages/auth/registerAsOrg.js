import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterAsOrg() {

    const navigate = useNavigate();

    {/* stare - retine informatii care se pot schimba in timp, in functie de ce face utilizatorul */ }
    {/* am creat o stare deoarece vrem sa retinem datele organizatiei */ }

    const [organisation, setOrganisation] = useState({
        orgName: "",
        contactEmail: "",
        contactNumber: "",
        location: "",
        password: "",
        confirmPassword: ""
    });

    // ia valorile din obiect si le pune in variabile separate
    const { orgName, contactEmail, contactNumber, location, password, confirmPassword } = organisation;

    // functie care se apeleaza cand utilizatorul modifica un input
    const onInputChange = (e) => {
        setOrganisation({
            ...organisation,
            [e.target.name]: e.target.value
        });
    };

    // functie care se apeleaza la submit
    const onSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            await axios.post("http://localhost:8080/api/registerAsOrganisation", {
                orgName,
                contactEmail,
                contactNumber,
                location,
                password,
                confirmPassword
            });
            alert("Organization registered successfully!");
            navigate("/organisationDashboard");
        } catch (error) {
            console.error("Registration error:", error);
            alert("An error occurred. Please try again.");
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
                        name="orgName"
                        value={orgName}
                        onChange={(e) => onInputChange(e)}
                        required
                    />
                    <input
                        type="email"
                        className="form-input"
                        placeholder="Contact Email"
                        name="contactEmail"
                        value={contactEmail}
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
