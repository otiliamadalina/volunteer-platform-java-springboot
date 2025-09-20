import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from "chart.js";
import "../../styles/admin.css";
import "../../styles/main.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function OrganisationDashboard() {
    const [dashboardData, setDashboardData] = useState({
        totalEvents: 0,
        volunteersJoined: 0,
        messagesSent: 0,
        participationRate: 0,
        upcomingEvents: [],
        recentActivity: [],
        topVolunteers: [],
        chartData: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            datasets: [
                {
                    label: "Participation",
                    data: [0, 0, 0, 0, 0, 0, 0],
                    borderColor: "#8b7d7b",
                    backgroundColor: "rgba(179,162,159,0.35)",
                    tension: 0.35,
                    fill: true,
                    pointRadius: 3
                }
            ]
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const orgEmail = localStorage.getItem("email") || "";
            const headers = {
                "X-Org-Email": orgEmail,
                "Content-Type": "application/json"
            };
            const credentials = "include";

            // Fetch all events for the organization
            const eventsResponse = await fetch("http://localhost:8080/api/org/events", {
                method: "GET",
                credentials,
                headers
            });

            // Fetch events with volunteers
            const eventsWithVolunteersResponse = await fetch("http://localhost:8080/api/orgs/events/with-volunteers", {
                method: "GET",
                credentials,
                headers
            });

            // Fetch sent notifications
            const notificationsResponse = await fetch("http://localhost:8080/api/notifications/sent-by-org", {
                method: "GET",
                credentials,
                headers
            });

            if (!eventsResponse.ok) {
                throw new Error(`Failed to fetch events: ${eventsResponse.status}`);
            }

            const events = await eventsResponse.json();
            const eventsWithVolunteers = eventsWithVolunteersResponse.ok ? await eventsWithVolunteersResponse.json() : [];
            const notifications = notificationsResponse.ok ? await notificationsResponse.json() : [];

            // Process the data
            const processedData = processDashboardData(events, eventsWithVolunteers, notifications);
            setDashboardData(processedData);

        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const processDashboardData = (events, eventsWithVolunteers, notifications) => {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // Calculate total events
        const totalEvents = events.length;
        const eventsThisMonth = events.filter(event => 
            new Date(event.createdAt) >= thisMonth
        ).length;
        const eventsLastMonth = events.filter(event => {
            const createdDate = new Date(event.createdAt);
            return createdDate >= lastMonth && createdDate < thisMonth;
        }).length;
        const eventsChange = eventsThisMonth - eventsLastMonth;

        // Calculate volunteers joined
        const allVolunteers = new Set();
        const volunteersThisMonth = new Set();
        const volunteersLastMonth = new Set();
        
        eventsWithVolunteers.forEach(event => {
            if (event.volunteers) {
                event.volunteers.forEach(volunteer => {
                    allVolunteers.add(volunteer.email);
                    // Note: We don't have join date, so we'll use event creation as proxy
                    const eventDate = new Date(event.createdAt);
                    if (eventDate >= thisMonth) {
                        volunteersThisMonth.add(volunteer.email);
                    } else if (eventDate >= lastMonth && eventDate < thisMonth) {
                        volunteersLastMonth.add(volunteer.email);
                    }
                });
            }
        });
        
        const volunteersJoined = allVolunteers.size;
        const volunteersChange = volunteersThisMonth.size - volunteersLastMonth.size;

        // Calculate messages sent
        const messagesSent = notifications.length;
        const messagesThisMonth = notifications.filter(notif => 
            new Date(notif.sentAt) >= thisMonth
        ).length;
        const messagesLastMonth = notifications.filter(notif => {
            const sentDate = new Date(notif.sentAt);
            return sentDate >= lastMonth && sentDate < thisMonth;
        }).length;
        const messagesChange = messagesThisMonth - messagesLastMonth;

        // Calculate participation rate
        const totalEventSlots = events.reduce((sum, event) => sum + (event.maxVolunteers || 0), 0);
        const filledSlots = events.reduce((sum, event) => sum + (event.currentVolunteers || 0), 0);
        const participationRate = totalEventSlots > 0 ? Math.round((filledSlots / totalEventSlots) * 100) : 0;

        // Get upcoming events
        const upcomingEvents = events
            .filter(event => new Date(event.startDate) > now)
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            .slice(0, 3)
            .map(event => ({
                title: event.title,
                date: new Date(event.startDate).toISOString().split('T')[0],
                location: event.location,
                volunteers: event.currentVolunteers || 0
            }));

        // Generate recent activity
        const recentActivity = [
            ...events.slice(-2).map(event => ({
                icon: "🟢",
                text: `Created event "${event.title}"`,
                time: getTimeAgo(event.createdAt)
            })),
            ...notifications.slice(-1).map(notif => ({
                icon: "📩",
                text: "Sent message to volunteers",
                time: getTimeAgo(notif.sentAt)
            }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 3);

        // Get top volunteers
        const volunteerEventCount = {};
        eventsWithVolunteers.forEach(event => {
            if (event.volunteers) {
                event.volunteers.forEach(volunteer => {
                    volunteerEventCount[volunteer.email] = (volunteerEventCount[volunteer.email] || 0) + 1;
                });
            }
        });
        
        const topVolunteers = Object.entries(volunteerEventCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([email, count]) => {
                const volunteer = eventsWithVolunteers
                    .flatMap(event => event.volunteers || [])
                    .find(v => v.email === email);
                return `${volunteer?.fullName || email} (${count} events)`;
            });

        // Generate chart data (simplified - using monthly event creation)
        const monthlyData = Array(7).fill(0);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
        const currentMonth = now.getMonth();
        
        for (let i = 0; i < 7; i++) {
            const monthIndex = (currentMonth - 6 + i + 12) % 12;
            const monthEvents = events.filter(event => {
                const eventDate = new Date(event.createdAt);
                return eventDate.getMonth() === monthIndex;
            });
            monthlyData[i] = monthEvents.reduce((sum, event) => sum + (event.currentVolunteers || 0), 0);
        }

        return {
            totalEvents,
            eventsChange,
            volunteersJoined,
            volunteersChange,
            messagesSent,
            messagesChange,
            participationRate,
            upcomingEvents,
            recentActivity,
            topVolunteers,
            chartData: {
                labels: monthNames,
                datasets: [
                    {
                        label: "Participation",
                        data: monthlyData,
                        borderColor: "#8b7d7b",
                        backgroundColor: "rgba(179,162,159,0.35)",
                        tension: 0.35,
                        fill: true,
                        pointRadius: 3
                    }
                ]
            }
        };
    };

    const getTimeAgo = (dateString) => {
        if (!dateString) return "Unknown";
        const now = new Date();
        const date = new Date(dateString);
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return "1d ago";
        return `${diffInDays}d ago`;
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: "#eee" }, beginAtZero: true } }
    };

    if (loading) {
        return (
            <>
                <h1>Organisation Dashboard</h1>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading dashboard data...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <h1>Organisation Dashboard</h1>
                <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                    <p>Error loading dashboard: {error}</p>
                    <button onClick={fetchDashboardData} style={{ marginTop: '10px', padding: '8px 16px' }}>
                        Retry
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <h1>Organisation Dashboard</h1>

            {/* Overview Statistics */}
            <div className="stats-container">
                <div className="stat-card events">
                    <h3>Total Events</h3>
                    <p>{dashboardData.totalEvents}</p>
                    <span className={`stat-change ${dashboardData.eventsChange >= 0 ? 'increase' : 'decrease'}`}>
                        {dashboardData.eventsChange >= 0 ? '+' : ''}{dashboardData.eventsChange} this month
                    </span>
                </div>
                <div className="stat-card volunteers">
                    <h3>Volunteers Joined</h3>
                    <p>{dashboardData.volunteersJoined}</p>
                    <span className={`stat-change ${dashboardData.volunteersChange >= 0 ? 'increase' : 'decrease'}`}>
                        {dashboardData.volunteersChange >= 0 ? '+' : ''}{dashboardData.volunteersChange} this month
                    </span>
                </div>
                <div className="stat-card messages">
                    <h3>Messages Sent</h3>
                    <p>{dashboardData.messagesSent}</p>
                    <span className={`stat-change ${dashboardData.messagesChange >= 0 ? 'increase' : 'decrease'}`}>
                        {dashboardData.messagesChange >= 0 ? '+' : ''}{dashboardData.messagesChange} this month
                    </span>
                </div>
                <div className="stat-card participation">
                    <h3>Participation Rate</h3>
                    <p>{dashboardData.participationRate}%</p>
                    <span className="stat-change increase">Real-time data</span>
                </div>
            </div>

            {/* Upcoming Events */}
            <section className="card">
            <h3>Upcoming Events</h3>
            <ul className="event-list">
                {dashboardData.upcomingEvents.length > 0 ? (
                    dashboardData.upcomingEvents.map((event, i) => (
                        <li key={i} className="event-item">
                            <div>
                                <strong>{event.title}</strong> - {event.date} @ {event.location} ({event.volunteers} volunteers)
                            </div>
                            <Link
                                to={`/organisationDashboard/manageEvents/`}
                                className="manage-button"
                            >
                                Manage
                            </Link>
                        </li>
                    ))
                ) : (
                    <li className="event-item">
                        <div>No upcoming events found. Create your first event!</div>
                    </li>
                )}
            </ul>
        </section>


            {/* Recent Activity */}
            <section className="card">
                <h3>Recent Activity</h3>
                <ul className="activity-list">
                    {dashboardData.recentActivity.length > 0 ? (
                        dashboardData.recentActivity.map((activity, i) => (
                            <li key={i} className="activity-item">
                                <span>{activity.icon}</span> {activity.text}
                                <span className="meta">{activity.time}</span>
                            </li>
                        ))
                    ) : (
                        <li className="activity-item">
                            <span>📝</span> No recent activity
                            <span className="meta">Get started by creating events!</span>
                        </li>
                    )}
                </ul>
            </section>

            {/* Top Volunteers */}
            <section className="card">
                <h3>Top Volunteers</h3>
                <ul className="top-volunteers">
                    {dashboardData.topVolunteers.length > 0 ? (
                        dashboardData.topVolunteers.map((volunteer, i) => (
                            <li key={i}>{volunteer}</li>
                        ))
                    ) : (
                        <li>No volunteer data available yet</li>
                    )}
                </ul>
            </section>

            {/* Participation Chart */}
            <section className="card">
                <h3>Monthly Participation</h3>
                <div style={{ height: 300 }}>
                    <Line data={dashboardData.chartData} options={chartOptions} />
                </div>
            </section>
        </>
    );
}
