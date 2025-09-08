import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/admin.css";
import "../../styles/main.css";

export default function AdminLeftPanel() {
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/");
        }
    }, []);

    return (
        <div className="left-panel">
            <ul className="menu">
                <li><Link to="/adminDashboard">Dashboard</Link></li>
                <li><Link to="/adminDashboard/ManageVolunteers">Manage Volunteers</Link></li>
                <li><Link to="/adminDashboard/ManageOrganisations">Manage Organisations</Link></li>
                <li><Link to="/adminDashboard/ManageEvents">Manage Events</Link></li>
                <li><Link to="/adminDashboard/Activity">Activity</Link></li>
                <li><Link to="/adminDashboard/Feedbacks">Feedbacks</Link></li>
            </ul>
        </div>

    );
}
