import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import "../../styles/admin.css";
import "../../styles/main.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function AdminDashboard() {
    const chartData = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
            {
                label: "Engagement",
                data: [120, 180, 150, 220, 260, 240, 300],
                borderColor: "#8b7d7b",
                backgroundColor: "rgba(179, 162, 159, 0.35)",
                tension: 0.35,
                fill: true,
                pointRadius: 3
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { intersect: false, mode: "index" }
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: "#eee" }, beginAtZero: true }
        }
    };

    return (
            <>
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
                        <div style={{ height: 320 }}>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </section>

                    <section className="card">
                        <h3>Calendar</h3>
                        <Calendar 
                            className="admin-calendar" 
                            locale="en-GB"
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
            </>
    );
}
