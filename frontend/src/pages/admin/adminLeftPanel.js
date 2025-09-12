import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/admin.css";
import "../../styles/main.css";

export default function AdminLeftPanel() {

    return (
        <div className="left-panel">
            <div className="left-panel-header">
                <h2>Admin</h2>
                <span className="left-panel-sub">controls</span>
            </div>
            <ul className="menu">
                <li>
                    <NavLink to="/adminDashboard" className={({ isActive }) => isActive ? "active" : undefined}>Dashboard</NavLink>
                </li>
                <li>
                    <NavLink to="/adminDashboard/manageVolunteers" className={({ isActive }) => isActive ? "active" : undefined}>Manage Volunteers</NavLink>
                </li>
                <li>
                    <NavLink to="/adminDashboard/manageOrganisations" className={({ isActive }) => isActive ? "active" : undefined}>Manage Organisations</NavLink>
                </li>
                <li>
                    <NavLink to="/adminDashboard/manageEvents" className={({ isActive }) => isActive ? "active" : undefined}>Manage Events</NavLink>
                </li>
                <li>
                    <NavLink to="/adminDashboard/manageActivity" className={({ isActive }) => isActive ? "active" : undefined}>Manage Activity</NavLink>
                </li>
                <li>
                    <NavLink to="/adminDashboard/manageFeedbacks" className={({ isActive }) => isActive ? "active" : undefined}>Manage Feedbacks</NavLink>
                </li>
            </ul>
        </div>

    );
}
