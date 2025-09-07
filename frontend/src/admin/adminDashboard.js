import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css"
import "../styles/main.css"

export default function AdminDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/");
        }
    }, []);

    return (
        <div className="dashboard-wrapper">
            <div className="left-panel">
                <ul className="menu">
                    <li>Dashboard</li>
                    <li>Manage Volunteers</li>
                    <li>Manage Organisations</li>
                    <li>Manage Events</li>
                    <li>Activity</li>
                    <li>Feedbacks</li>
                </ul>
            </div>


            <main className="dashboard-main">
                <h1>Admin Dashboard</h1>

                <div className="stats-container">
                    <div className="stat-card volunteers">
                        <h3>Active Volunteers</h3>
                        <p>1,245</p>
                        <span className="stat-change increase">+12% this week</span>
                    </div>

                    <div className="stat-card projects">
                        <h3>Ongoing Projects</h3>
                        <p>36</p>
                        <span className="stat-change decrease">-3 new</span>
                    </div>

                    <div className="stat-card hours">
                        <h3>Hours Contributed</h3>
                        <p>8,430</p>
                        <span className="stat-change increase">+540 hrs</span>
                    </div>
                </div>

                <div className="section-labels">
                </div>
            </main>
        </div>
    );
}
