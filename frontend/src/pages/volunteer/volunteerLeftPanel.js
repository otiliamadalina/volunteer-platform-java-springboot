import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/admin.css";
import "../../styles/main.css";

export default function VolunteerLeftPanel() {
    return (
        <div className="left-panel">
            <div className="left-panel-header">
                <h2>Volunteer</h2>
                <span className="left-panel-sub">menu</span>
            </div>
            <ul className="menu">
                <li>
                    <NavLink to="/volunteerDashboard" className={({ isActive }) => isActive ? "active" : undefined}>Dashboard</NavLink>
                </li>

                <li>
                    <NavLink to="/volunteerDashboard/joinedEvents" className={({ isActive }) => isActive ? "active" : undefined}>
                        My Events
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/volunteerDashboard/joinedEventsDetails" className={({ isActive }) => isActive ? "active" : undefined}>Joined Events Details</NavLink>
                </li>

                <li>
                    <NavLink to="/volunteerDashboard/participationHistory" className={({ isActive }) => isActive ? "active" : undefined}>Participation History</NavLink>
                </li>
                <li>
                    <NavLink to="/volunteerDashboard/editProfile" className={({ isActive }) => isActive ? "active" : undefined}>Edit Profile</NavLink>
                </li>


            </ul>
        </div>
    );
}


