import React from "react";
import "react-calendar/dist/Calendar.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
} from "chart.js";
import { Line } from "react-chartjs-2";
import "../../styles/admin.css";
import "../../styles/main.css";
import VolunteerCalendar from "../volunteer/volunteerCalendar";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export default function AdminDashboard() {
    const { useState, useEffect, useMemo } = React;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [volunteers, setVolunteers] = useState([]);
    const [organisations, setOrganisations] = useState([]);
    const [events, setEvents] = useState([]); // published events
    const [registrations, setRegistrations] = useState([]); // recent volunteer/org registrations
    const [joins, setJoins] = useState([]); // recent event joins

    // --- Helper function defined before usage
    const timeAgo = (dateStr) => {
        if (!dateStr) return "";
        const now = new Date();
        const d = new Date(dateStr);
        const diffMs = now - d;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        if (hours < 1) return "Just now";
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days === 1) return "1d ago";
        return `${days}d ago`;
    };

    const downloadCSV = (rows, filename) => {
        if (!rows || rows.length === 0) return;
        const headers = Object.keys(rows[0]);
        const csv = [headers.join(",")]
            .concat(
                rows.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(","))
            )
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                setError(null);

                const cred = { credentials: "include" };

                const [volRes, orgRes, evRes, regRes, joinRes] = await Promise.all([
                    fetch("http://localhost:8080/api/admin/manageVolunteers", { method: "GET", ...cred }),
                    fetch("http://localhost:8080/api/orgs", { method: "GET", ...cred }),
                    fetch("http://localhost:8080/api/org/public/events", { method: "GET", ...cred }),
                    fetch("http://localhost:8080/api/admin/recent-registrations", { method: "GET", ...cred }),
                    fetch("http://localhost:8080/api/admin/recent-joins", { method: "GET", ...cred })
                ]);

                if (!volRes.ok) throw new Error(`Volunteers fetch failed: ${volRes.status}`);
                if (!orgRes.ok) throw new Error(`Organisations fetch failed: ${orgRes.status}`);
                if (!evRes.ok) throw new Error(`Events fetch failed: ${evRes.status}`);

                const [volData, orgData, evData] = await Promise.all([
                    volRes.json(),
                    orgRes.json(),
                    evRes.json()
                ]);
                const regData = regRes.ok ? await regRes.json() : [];
                const joinData = joinRes.ok ? await joinRes.json() : [];

                setVolunteers(Array.isArray(volData) ? volData : []);
                setOrganisations(Array.isArray(orgData) ? orgData : []);
                setEvents(Array.isArray(evData) ? evData : []);
                setRegistrations(Array.isArray(regData) ? regData : []);
                setJoins(Array.isArray(joinData) ? joinData : []);
            } catch (e) {
                console.error("Admin dashboard fetch error:", e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const stats = useMemo(() => {
        const totalVolunteers = volunteers.length;
        const totalOrganisations = organisations.length;
        const totalPublishedEvents = events.length;

        const now = new Date();
        const labels = [];
        const data = [];

        for (let i = 6; i >= 0; i--) {
            const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
            const dayStr = day.toLocaleDateString(undefined, { month: "short", day: "numeric" });
            labels.push(dayStr);
            const participants = events
                .filter(e => {
                    const d = new Date(e.startDate || e.createdAt);
                    return d.getFullYear() === day.getFullYear() &&
                        d.getMonth() === day.getMonth() &&
                        d.getDate() === day.getDate();
                })
                .reduce((sum, e) => sum + (e.currentVolunteers || 0), 0);
            data.push(participants);
        }

        const orgCountMap = {};
        events.forEach(e => {
            const key = e.organisationName || e.organisationEmail || "Unknown";
            orgCountMap[key] = (orgCountMap[key] || 0) + 1;
        });
        const topOrgs = Object.entries(orgCountMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        const eventDateSet = new Set(
            events
                .map(e => e.startDate)
                .filter(Boolean)
                .map(d => new Date(d).toDateString())
        );

        return { totalVolunteers, totalOrganisations, totalPublishedEvents, chartData: { labels, datasets: [{ label: "Participants per day", data, borderColor: "#8b7d7b", backgroundColor: "rgba(179, 162, 159, 0.35)", tension: 0.35, fill: true, pointRadius: 3 }] }, topOrgs, eventDateSet };
    }, [volunteers, organisations, events]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { intersect: false, mode: "index" } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: "#eee" }, beginAtZero: true } }
    };

    const recentActivity = useMemo(() => {
        const eventItems = (events || [])
            .map(e => ({
                ts: new Date(e.createdAt || e.startDate).getTime() || 0,
                title: `New event: ${e.title}`,
                org: e.organisationName || e.organisationEmail || "",
                meta: timeAgo(e.createdAt || e.startDate)
            }));

        const regItems = (registrations || [])
            .filter(r => r && r.createdAt)
            .map(r => ({
                ts: new Date(r.createdAt).getTime(),
                title: `${r.email} has registered (${r.role === 'ORGANISATION' ? 'organisation' : 'volunteer'})`,
                org: r.name || r.role,
                meta: timeAgo(r.createdAt)
            }));

        const joinItems = (joins || [])
            .filter(j => j && j.joinedAt)
            .map(j => ({
                ts: new Date(j.joinedAt).getTime(),
                title: `${j.volunteerEmail || j.volunteerName || 'Volunteer'} joined ${j.eventTitle}`,
                org: j.organisationName || '',
                meta: timeAgo(j.joinedAt)
            }));

        return [...eventItems, ...regItems, ...joinItems]
            .sort((a, b) => b.ts - a.ts)
            .slice(0, 5);
    }, [events, registrations, joins]);

    if (loading) return <div style={{ textAlign: "center", padding: 40 }}>Loading...</div>;
    if (error) return <div style={{ textAlign: "center", padding: 40, color: "red" }}>Failed to load: {error}</div>;

    return (
        <>
            <h1>Admin Dashboard</h1>

            <div className="stats-container">
                <div className="stat-card volunteers">
                    <h3>Active Volunteers</h3>
                    <p>{stats.totalVolunteers}</p>
                    <span className="stat-change increase">Live</span>
                </div>
                <div className="stat-card projects">
                    <h3>Organisations</h3>
                    <p>{stats.totalOrganisations}</p>
                    <span className="stat-change increase">Live</span>
                </div>
                <div className="stat-card hours">
                    <h3>Published Events</h3>
                    <p>{stats.totalPublishedEvents}</p>
                    <span className="stat-change increase">Live</span>
                </div>
            </div>

            <div className="dashboard-grid" style={{ display: "flex", gap: 20 }}>
                {/* Engagement Chart */}
                <section className="card" style={{ flex: 2 }}>
                    <h3>Engagement Over Time</h3>
                    <div style={{ height: 320 }}>
                        <Line data={stats.chartData} options={chartOptions} />
                    </div>
                </section>

                {/* Calendar */}
                <section className="card" style={{ flex: 1 }}>
                    <h3>Calendar</h3>
                    <VolunteerCalendar />
                </section>
            </div>

            <section className="card" style={{ marginTop: 20 }}>
                <h3>Recent Activity</h3>
                <div className="activity-list">
                    {recentActivity.length === 0 && <div className="activity-item">No recent activity.</div>}
                    {recentActivity.map((a, idx) => (
                        <div key={idx} className="activity-item">
                            <div><strong>{a.title}</strong> • {a.org}</div>
                            <div className="meta">{a.meta}</div>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: 10, textAlign: 'right' }}>
                    <a className="btn btn-link" href="/adminDashboard/manageActivity">View all activity →</a>
                </div>
            </section>

            <section className="card" style={{ marginTop: 20 }}>
                <h3>Top Organisations</h3>
                <ul className="top-volunteers">
                    {stats.topOrgs.length === 0 && <li>No organisations yet</li>}
                    {stats.topOrgs.map((o, i) => (
                        <li key={i}>{o.name} ({o.count} events)</li>
                    ))}
                </ul>
            </section>
        </>
    );
}
