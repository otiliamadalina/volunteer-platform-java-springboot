import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/admin.css";
import "../../styles/main.css";

export default function OrgLeftPanel() {
    return (
        <div className="left-panel">
            <div className="left-panel-header">
                <h2>Organisation</h2>
                <span className="left-panel-sub">controls</span>
            </div>
            <ul className="menu">
                <li>
                    <NavLink to="/organisationDashboard" className={({ isActive }) => isActive ? "active" : undefined}>Dashboard</NavLink>
                </li>
                <li>
                    <NavLink to="/organisationDashboard/createEvent" className={({ isActive }) => isActive ? "active" : undefined}>Create Event</NavLink>
                </li>
                <li>
                    <NavLink to="/organisationDashboard/manageEvents" className={({ isActive }) => isActive ? "active" : undefined}>Manage Event List</NavLink>
                </li>
                <li>
                    <NavLink to="/organisationDashboard/reports" className={({ isActive }) => isActive ? "active" : undefined}>Reports / Volunteer Stats</NavLink>
                </li>
                <li>
                    <NavLink to="/organisationDashboard/notifyVolunteers" className={({ isActive }) => isActive ? "active" : undefined}>Notify Volunteers</NavLink>
                </li>
            </ul>
        </div>
    );
}


