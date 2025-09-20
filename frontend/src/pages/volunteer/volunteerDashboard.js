import React from "react";
import "../../styles/admin.css";
import "../../styles/main.css";
import "../../styles/volunteer.css"; // Include the main CSS file for volunteer styles
import VolunteerCalendar from "./volunteerCalendar"; // Component for the calendar
import UpcomingEvents from "./upcomingEvents"; // Component for the list of upcoming events
import RecentMessages from "./recentMessages"; // Component for recent messages

export default function VolunteerDashboard() {
    return (
        <div className="volunteer-dashboard-container">
            <h1 className="dashboard-title">Volunteer Dashboard</h1>

            <div className="dashboard-header-card">
                <h3>Welcome!</h3>
                <p>Quick overview of your upcoming events and recent activity.</p>
            </div>

            <div className="dashboard-grid">
                {/* Section 1: Event Calendar */}
                <div className="dashboard-card calendar-card">
                    <h2>Calendar</h2>
                    <VolunteerCalendar />
                </div>

                {/* Section 2: Upcoming Events */}
                <div className="dashboard-card events-card">
                    <h2>Upcoming</h2>
                    <UpcomingEvents />
                </div>

                {/* Section 3: Recent Messages */}
                <div className="dashboard-card messages-card">
                    <h2>Recent Messages</h2>
                    <RecentMessages />
                </div>
            </div>
        </div>
    );
}