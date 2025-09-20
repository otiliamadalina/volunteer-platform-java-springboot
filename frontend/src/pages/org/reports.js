import React, { useEffect, useMemo, useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
} from "chart.js";
import "../../styles/admin.css";
import "../../styles/main.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

export default function Reports() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);
    const [eventsWithVolunteers, setEventsWithVolunteers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const orgEmail = localStorage.getItem("email") || "";
                const headers = {
                    "X-Org-Email": orgEmail,
                    "Content-Type": "application/json"
                };
                const cred = "include";

                const [evRes, evvRes] = await Promise.all([
                    fetch("http://localhost:8080/api/org/events", { method: "GET", credentials: cred, headers }),
                    fetch("http://localhost:8080/api/orgs/events/with-volunteers", { method: "GET", credentials: cred, headers })
                ]);

                if (!evRes.ok) throw new Error(`Failed to fetch events: ${evRes.status}`);
                const evData = await evRes.json();
                const evvData = evvRes.ok ? await evvRes.json() : [];
                setEvents(Array.isArray(evData) ? evData : []);
                setEventsWithVolunteers(Array.isArray(evvData) ? evvData : []);
            } catch (e) {
                console.error("Reports fetch error:", e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const kpis = useMemo(() => {
        const totalEvents = events.length;
        const published = events.filter(e => String(e.status).toUpperCase() === 'PUBLISHED').length;
        const draft = events.filter(e => String(e.status).toUpperCase() === 'DRAFT').length;
        const totalMax = events.reduce((s, e) => s + (e.maxVolunteers || 0), 0);
        const totalCurr = events.reduce((s, e) => s + (e.currentVolunteers || 0), 0);
        const participation = totalMax > 0 ? Math.round((totalCurr / totalMax) * 100) : 0;
        const uniqueVolunteers = new Set(
            (eventsWithVolunteers || []).flatMap(ev => (ev.volunteers || []).map(v => v.email))
        ).size;
        return { totalEvents, published, draft, participation, uniqueVolunteers, totalCurr, totalMax };
    }, [events, eventsWithVolunteers]);

    const lineData = useMemo(() => {
        const now = new Date();
        const labels = [];
        const counts = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = d.toLocaleDateString(undefined, { month: "short", year: i === 5 ? "numeric" : undefined });
            labels.push(label);
            const c = events.filter(e => {
                const cd = new Date(e.createdAt);
                return cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth();
            }).length;
            counts.push(c);
        }
        return {
            labels,
            datasets: [{
                label: "Events created",
                data: counts,
                borderColor: "#8b7d7b",
                backgroundColor: "rgba(179,162,159,0.35)",
                fill: true,
                tension: 0.35,
                pointRadius: 3
            }]
        };
    }, [events]);

    const statusData = useMemo(() => {
        const published = events.filter(e => String(e.status).toUpperCase() === 'PUBLISHED').length;
        const draft = events.filter(e => String(e.status).toUpperCase() === 'DRAFT').length;
        const completed = events.filter(e => String(e.status).toUpperCase() === 'COMPLETED').length;
        const cancelled = events.filter(e => String(e.status).toUpperCase() === 'CANCELLED').length;
        return {
            labels: ["Published", "Draft", "Completed", "Cancelled"],
            datasets: [{
                label: "Count",
                data: [published, draft, completed, cancelled],
                backgroundColor: ["#96b38a", "#d0c9c2", "#8b7d7b", "#d8a7a7"]
            }]
        };
    }, [events]);

    const locationData = useMemo(() => {
        const map = {};
        events.forEach(e => {
            const key = e.location || "Unknown";
            map[key] = (map[key] || 0) + 1;
        });
        const entries = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
        return {
            labels: entries.map(e => e[0]),
            datasets: [{
                data: entries.map(e => e[1]),
                backgroundColor: ["#8b7d7b", "#b3a29f", "#96b38a", "#d0c9c2", "#c7b9a5", "#a9b1a8"]
            }]
        };
    }, [events]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: "#eee" }, beginAtZero: true } }
    };
    
    if (loading) return <div className="card" style={{ marginTop: 20, padding: 20 }}><h3>Reports</h3><p>Loading...</p></div>;
    if (error) return <div className="card" style={{ marginTop: 20, padding: 20, color: 'red' }}><h3>Reports</h3><p>Error: {error}</p></div>;

    return (
        <div className="dashboard-grid" style={{ gap: 20, marginTop: 20 }}>
            <section className="card" style={{ gridColumn: '1 / -1' }}>
                <h3>Organisation Reports</h3>
                <div className="stats-container" style={{ marginTop: 10 }}>
                    <div className="stat-card">
                        <h4>Total Events</h4>
                        <p>{kpis.totalEvents}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Published</h4>
                        <p>{kpis.published}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Draft</h4>
                        <p>{kpis.draft}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Unique Volunteers</h4>
                        <p>{kpis.uniqueVolunteers}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Participation</h4>
                        <p>{kpis.participation}%</p>
                    </div>
                </div>
            </section>

            <section className="card">
                <h3>Events Created (last 6 months)</h3>
                <div style={{ height: 300 }}>
                    <Line data={lineData} options={chartOptions} />
                </div>
            </section>

            <section className="card">
                <h3>Status Breakdown</h3>
                <div style={{ height: 300 }}>
                    <Bar data={statusData} options={chartOptions} />
                </div>
            </section>

            <section className="card">
                <h3>Top Locations</h3>
                <div style={{ height: 300 }}>
                    <Doughnut data={locationData} />
                </div>
            </section>

            <section className="card" style={{ gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Events Table</h3>
                </div>
                <div className="table-container" style={{ marginTop: 10 }}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Location</th>
                                <th>Participants</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(ev => (
                                <tr key={ev.id}>
                                    <td>{ev.id}</td>
                                    <td>{ev.title}</td>
                                    <td>{ev.status}</td>
                                    <td>{ev.startDate ? new Date(ev.startDate).toLocaleString() : '-'}</td>
                                    <td>{ev.endDate ? new Date(ev.endDate).toLocaleString() : '-'}</td>
                                    <td>{ev.location}</td>
                                    <td>{(ev.currentVolunteers || 0)}/{(ev.maxVolunteers || 0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
