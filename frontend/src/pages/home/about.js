import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/about.css';

export function About() {
    const role = useMemo(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("role");
        }
        return null;
    }, []);

    const getDashboardLink = () => {
        switch (role) {
            case "VOLUNTEER":
                return "/volunteerDashboard";
            case "ORGANISATION":
                return "/organisationDashboard";
            case "ADMIN":
                return "/adminDashboard";
            default:
                return "/volunteerOrOrg";
        }
    };

    const getButtonText = () => {
        switch (role) {
            case "VOLUNTEER":
            case "ORGANISATION":
            case "ADMIN":
                return "Go to Dashboard";
            default:
                return "Join as a Volunteer or Organization";
        }
    };

    return (
        <div className="about-container">
            <header className="about-header">
                <h1>About Us</h1>
                <p>Our mission: connecting people with organizations that need a hand.</p>
            </header>

            <section className="about-intro">
                <h2>Who Are We?</h2>
                <p>
                    We are a volunteer platform created to facilitate the connection
                    between eager volunteers and non-profit organizations running impactful projects.
                    We believe that every act of kindness, no matter how small, can change the world.
                </p>
            </section>

            <section className="about-mission">
                <h2>Our Mission</h2>
                <p>
                    Our mission is to build a strong community where volunteers can quickly
                    find events and causes that resonate with their passions and skills.
                    We aim to support organizations in growing their volunteer base and
                    achieving their goals.
                </p>
            </section>

            <section className="about-call-to-action">
                <h2>Start Making a Difference Today!</h2>
                <p>
                    Join our community and contribute to a better future.
                </p>
                <div className="about-buttons">
                    <Link to={getDashboardLink()} className="btn nav-btn-login me-2">
                        {getButtonText()}
                    </Link>

                    <Link to="/events" className="btn nav-btn-login me-2">
                        Explore Events
                    </Link>
                </div>
            </section>
        </div>
    );
}