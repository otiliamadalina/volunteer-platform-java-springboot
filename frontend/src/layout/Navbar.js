import React from "react";
import {Link, useNavigate} from "react-router-dom";
import "../styles/navbar.css";
import "../styles/main.css"


export default function Navbar() {

    const navigate = useNavigate();


    const role = localStorage.getItem("role");
    const userName = localStorage.getItem("userName");

    const dashboardRoute = role === "volunteer"
        ? "/volunteerDashboard"


        : role === "organisation"
            ? "/organisationDashboard"

            : role === "admin"
                ? "/adminDashboard"

                : "/";

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-custom">
            <div className="container-fluid">

                {/* Logo */}
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src="/assets/volunteer-pink-transparent-logo.png"
                         alt="Logo"
                         width="110"
                         height="50"
                         className="navbar-logo me-2"
                    />
                </Link>

                {/* Toggler pentru mobil */}
                <button
                    className="navbar-toggler d-lg-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Link-uri din dreapta */}
                <div className="collapse navbar-collapse justify-content-end " id="navbarSupportedContent">
                    <ul className="navbar-nav nav-mobile-center mb-2 mb-lg-0">

                        <li className="nav-item">
                            <Link className="nav-link custom-link" to="/about">About</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link custom-link" to="/statistic">Statistic</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link custom-link" to="/events">Events</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link custom-link" to="/organisations">ORG</Link>
                        </li>

                        {userName ? (
                            <>
                                <li className="nav-item mt-2 mt-lg-0">
                                    <Link className="btn nav-btn-register me-2" to={dashboardRoute}>
                                        {userName}
                                    </Link>
                                </li>
                                <li className="nav-item mt-2 mt-lg-0">
                                    <button className="btn nav-btn-login" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="btn nav-btn-register me-2" to="/volunteerOrOrg">Register</Link>
                                </li>
                                <li className="nav-item mt-2 mt-lg-0">
                                    <Link className="btn nav-btn-login" to="/login">Login</Link>
                                </li>
                            </>
                        )}


                    </ul>
                </div>
            </div>
        </nav>
    );
}
