import React from "react";
import { Link } from "react-router-dom";
import "../../styles/admin.css";
import "../../styles/main.css";

export default function AdminLeftPanel() {

    return (
        <div className="left-panel">
            <ul className="menu">
                <li><Link to="/adminDashboard">Dashboard</Link></li>
                <li><Link to="/adminDashboard/manageVolunteers">Manage Volunteers</Link></li>
                <li><Link to="/adminDashboard/manageOrganisations">Manage Organisations</Link></li>
                <li><Link to="/adminDashboard/manageEvents">Manage Events</Link></li>
                <li><Link to="/adminDashboard/manageActivity">Manage Activity</Link></li>
                <li><Link to="/adminDashboard/manageFeedbacks">Manage Feedbacks</Link></li>
            </ul>
        </div>

    );
}
