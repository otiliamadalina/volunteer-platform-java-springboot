import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterAsVolunteer() {

    const navigate = useNavigate();

    {/* stare - retine informatii care se pot schimba in timp, in functie de ce face utilizatorul */ }
    {/* am creat o stare deoarece vrem sa retinem datele voluntarului */ }

    const [volunteer, setVolunteer] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // ia valorile din obiect si le pune in variabile separate
    const { fullName, email, password, confirmPassword } = volunteer;

    // functie care se apeleaza cand utilizatorul modifica un input
    const onInputChange = (e) => {
        setVolunteer({
            ...volunteer,
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
            const res = await axios.post("http://localhost:8080/api/registerAsVolunteer", {
                fullName,
                email,
                password
            });

            const { fullName: name, role } = res.data;

            localStorage.setItem("userName", name);
            localStorage.setItem("role", role);

            navigate("/");
        } catch (error) {
            console.error("Registration error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="register-container">
            <button className="go-back-top-left" onClick={() => navigate(-1)}>← Go Back</button>

            <h2 className="register-title">Become a Volunteer</h2>
            <p className="register-subtitle">Fill in your details to join our community</p>

            <form className="register-form" onSubmit={(e) => onSubmit(e)}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Full Name"
                    name="fullName"
                    value={fullName}
                    onChange={(e) => onInputChange(e)}
                    required
                />
                <input
                    type="email"
                    className="form-input"
                    placeholder="Email Address"
                    name="email"
                    value={email}
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
                <button type="submit" className="btn-register-volunteer">Register</button>
            </form>
        </div>
    );
}
