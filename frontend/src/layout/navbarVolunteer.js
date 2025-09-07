import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

export default function NavbarVolunteer({ volunteerName }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-custom">
            <div className="container-fluid">

                {/* Logo */}
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img
                        src="/assets/volunteer-pink-transparent-logo.png"
                        alt="Logo"
                        width="110"
                        height="50"
                        className="navbar-logo me-2"
                    />
                </Link>

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

                <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
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

                        <li className="nav-item mt-2 mt-lg-0">
                            <Link className="btn nav-btn-dashboard" to="/volunteerDashboard">
                                {volunteerName}
                            </Link>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    );
}
