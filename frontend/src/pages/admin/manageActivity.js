import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminLeftPanel from "./adminLeftPanel";
import "../../styles/admin.css"
import "../../styles/main.css"

export default function ManageActivity() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [joins, setJoins] = useState([]);
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL"); // ALL | REGISTRATIONS | JOINS | EVENTS
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role && role.toUpperCase() !== "ADMIN") {
            navigate("/");
            return;
        }
        fetchAll();
    }, []);

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

    const fetchAll = async () => {
        try {
            setLoading(true);
            setError(null);
            const cred = { credentials: "include" };
            const [regRes, joinRes, evRes] = await Promise.all([
                fetch("http://localhost:8080/api/admin/recent-registrations", { method: "GET", ...cred }),
                fetch("http://localhost:8080/api/admin/recent-joins", { method: "GET", ...cred }),
                fetch("http://localhost:8080/api/admin/events", { method: "GET", ...cred })
            ]);

            const regData = regRes.ok ? await regRes.json() : [];
            const joinData = joinRes.ok ? await joinRes.json() : [];
            const evData = evRes.ok ? await evRes.json() : [];

            setRegistrations(Array.isArray(regData) ? regData : []);
            setJoins(Array.isArray(joinData) ? joinData : []);
            setEvents(Array.isArray(evData) ? evData : []);
        } catch (e) {
            console.error("ManageActivity fetch error:", e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const items = useMemo(() => {
        const regItems = (registrations || []).map(r => ({
            type: "REGISTRATION",
            ts: new Date(r.createdAt).getTime() || 0,
            title: `${r.email} has registered (${r.role === 'ORGANISATION' ? 'organisation' : 'volunteer'})`,
            subtitle: r.name || r.role,
            raw: r
        }));
        const joinItems = (joins || []).map(j => ({
            type: "JOIN",
            ts: new Date(j.joinedAt).getTime() || 0,
            title: `${j.volunteerEmail || j.volunteerName || 'Volunteer'} joined ${j.eventTitle}`,
            subtitle: j.organisationName || '',
            raw: j
        }));
        const eventItems = (events || []).map(e => ({
            type: "EVENT",
            ts: new Date(e.createdAt || e.startDate).getTime() || 0,
            title: `New event: ${e.title}`,
            subtitle: e.organisationName || e.organisationEmail || '',
            raw: e
        }));

        let merged = [...regItems, ...joinItems, ...eventItems];
        if (filter !== "ALL") {
            merged = merged.filter(x => x.type === filter);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            merged = merged.filter(x =>
                x.title.toLowerCase().includes(q) ||
                (x.subtitle || "").toLowerCase().includes(q)
            );
        }
        return merged.sort((a, b) => b.ts - a.ts);
    }, [registrations, joins, events, filter, search]);

    const openModal = (item) => {
        setSelected(item);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        setSelected(null);
    };

    return (
        <div className="dashboard-wrapper">
        

            <div className="card notify-manage-card" style={{ flex: 1 }}>
                <h3>Manage Activity</h3>

                <div className="row" style={{ marginBottom: 12 }}>
                    <div className="col-md-6">
                        <input
                            className="form-control"
                            placeholder="Search activity..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-md-6" style={{ textAlign: 'right' }}>
                        <div className="btn-group" role="group">
                            <button className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('ALL')}>All</button>
                            <button className={`btn btn-sm ${filter === 'REGISTRATION' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('REGISTRATION')}>Registrations</button>
                            <button className={`btn btn-sm ${filter === 'JOIN' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('JOIN')}>Joins</button>
                            <button className={`btn btn-sm ${filter === 'EVENT' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('EVENT')}>Events</button>
                        </div>
                    </div>
                </div>

                {loading && <p>Loading activity...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}

                {!loading && (
                    <div className="table-container">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Message</th>
                                    <th>When</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((it, idx) => (
                                    <tr key={idx}>
                                        <td>{it.type}</td>
                                        <td>
                                            <strong>{it.title}</strong>
                                            {it.subtitle && <div className="text-muted">{it.subtitle}</div>}
                                        </td>
                                        <td>{timeAgo(it.ts)}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => openModal(it)}>View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {items.length === 0 && <p className="empty-state">No activity found.</p>}
                    </div>
                )}
            </div>

            {/* View Modal */}
            {showModal && selected && (
                <div className="modal modal-overlay">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Activity Details</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Type:</strong> {selected.type}</p>
                                <p><strong>When:</strong> {new Date(selected.ts).toLocaleString()}</p>
                                {selected.type === 'REGISTRATION' && (
                                    <>
                                        <p><strong>Name:</strong> {selected.raw.name}</p>
                                        <p><strong>Email:</strong> {selected.raw.email}</p>
                                        <p><strong>Role:</strong> {selected.raw.role}</p>
                                    </>
                                )}
                                {selected.type === 'JOIN' && (
                                    <>
                                        <p><strong>Volunteer:</strong> {selected.raw.volunteerName || selected.raw.volunteerEmail}</p>
                                        <p><strong>Event:</strong> {selected.raw.eventTitle}</p>
                                        <p><strong>Organisation:</strong> {selected.raw.organisationName}</p>
                                    </>
                                )}
                                {selected.type === 'EVENT' && (
                                    <>
                                        <p><strong>Title:</strong> {selected.raw.title}</p>
                                        <p><strong>Status:</strong> {selected.raw.status}</p>
                                        <p><strong>Org Email:</strong> {selected.raw.organisationEmail}</p>
                                        <p><strong>Start:</strong> {selected.raw.startDate ? new Date(selected.raw.startDate).toLocaleString() : '-'}</p>
                                        <p><strong>End:</strong> {selected.raw.endDate ? new Date(selected.raw.endDate).toLocaleString() : '-'}</p>
                                        <p><strong>Location:</strong> {selected.raw.location}</p>
                                        <p><strong>Participants:</strong> {selected.raw.currentVolunteers}/{selected.raw.maxVolunteers}</p>
                                        {selected.raw.description && <p><strong>Description:</strong> {selected.raw.description}</p>}
                                    </>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}