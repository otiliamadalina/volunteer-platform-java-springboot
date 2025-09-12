import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AdminLeftPanel from "./admin-left-panel";
import "../../styles/admin.css"
import "../../styles/main.css"

export default function AdminDashboard() {

    return (
        <div className="dashboard-wrapper">
            <AdminLeftPanel />


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

                <div className="dashboard-grid">
                    <section className="card">
                        <h3>Engagement Over Time</h3>
                        <div className="chart-placeholder">Chart placeholder (install chart.js to enable)</div>
                    </section>

                    <section className="card">
                        <h3>Calendar</h3>
                        <Calendar 
                            className="admin-calendar" 
                            tileClassName={({ date }) => {
                                const eventDates = new Set([
                                    new Date().toDateString(),
                                    new Date(Date.now() + 86400000 * 3).toDateString(),
                                    new Date(Date.now() + 86400000 * 7).toDateString()
                                ]);
                                return eventDates.has(date.toDateString()) ? "has-event" : undefined;
                            }}
                        />
                    </section>
                </div>

                <section className="card" style={{ marginTop: 20 }}>
                    <h3>Recent Activity</h3>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div>
                                <strong>New event</strong> • Tree planting day added by GreenOrg
                            </div>
                            <div className="meta">2h ago</div>
                        </div>
                        <div className="activity-item">
                            <div>
                                <strong>Volunteer joined</strong> • Maria I. joined Beach Cleanup
                            </div>
                            <div className="meta">5h ago</div>
                        </div>
                        <div className="activity-item">
                            <div>
                                <strong>Feedback</strong> • “Great coordination!” from John D.
                            </div>
                            <div className="meta">1d ago</div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
