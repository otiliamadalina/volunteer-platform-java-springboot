import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLeftPanel from "./adminLeftPanel";
import "../../styles/admin.css"
import "../../styles/main.css"

export default function ManageEvents() {
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role && role.toUpperCase() !== "ADMIN") {
            navigate("/");
            return;
        }
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch("http://localhost:8080/api/admin/events", {
                method: "GET",
                credentials: "include"
            });
            if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
            const data = await res.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("Failed to fetch events:", e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(e => {
        const q = searchTerm.toLowerCase();
        return (
            (e.title || "").toLowerCase().includes(q) ||
            (e.location || "").toLowerCase().includes(q) ||
            (e.organisationEmail || "").toLowerCase().includes(q) ||
            (e.status || "").toLowerCase().includes(q)
        );
    });

    const handleView = async (event) => {
        try {
            const res = await fetch(`http://localhost:8080/api/admin/events/${event.id}`, {
                method: "GET",
                credentials: "include"
            });
            if (res.ok) {
                const details = await res.json();
                setSelectedEvent(details);
                setShowViewModal(true);
            } else {
                alert("Failed to load event details");
            }
        } catch (e) {
            console.error("View event error:", e);
            alert("Failed to load event details");
        }
    };

    const handleUnpublish = async (eventId) => {
        if (!window.confirm("Unpublish this event? It will appear as DRAFT in the organisation account.")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/admin/events/${eventId}/unpublish`, {
                method: "PUT",
                credentials: "include"
            });
            if (res.ok) {
                const updated = await res.json();
                setEvents(prev => prev.map(e => e.id === eventId ? updated : e));
                alert("Event set to DRAFT (unpublished).");
            } else {
                const text = await res.text();
                alert("Failed to unpublish: " + text);
            }
        } catch (e) {
            console.error("Unpublish error:", e);
            alert("Failed to unpublish event.");
        }
    };

    const handleDelete = async (eventId) => {
        if (!window.confirm("Are you sure you want to DELETE this event? This action cannot be undone.")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/admin/events/${eventId}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (res.ok || res.status === 204) {
                setEvents(prev => prev.filter(e => e.id !== eventId));
                alert("Event deleted successfully.");
            } else {
                const text = await res.text();
                alert("Failed to delete event: " + text);
            }
        } catch (e) {
            console.error("Delete error:", e);
            alert("Failed to delete event.");
        }
    };

    const handleCloseModal = () => {
        setShowViewModal(false);
        setSelectedEvent(null);
    };

    return (
        <div className="dashboard-wrapper">

            <div className="card notify-manage-card" style={{ flex: 1 }}>
                <h3>Manage Events</h3>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search events by title, status, location or org email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control search-input"
                    />
                </div>

                {loading && <p>Loading events...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}

                {!loading && (
                    <div className="table-container">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Location</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEvents.map(ev => (
                                    <tr key={ev.id}>
                                        <td>{ev.id}</td>
                                        <td>{ev.title}</td>
                                        <td>{ev.startDate ? new Date(ev.startDate).toLocaleString() : "-"}</td>
                                        <td>{ev.endDate ? new Date(ev.endDate).toLocaleString() : "-"}</td>
                                        <td>{ev.location}</td>
                                        <td>
                                            <button 
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleView(ev)}
                                            >
                                                View
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-warning me-2"
                                                onClick={() => handleUnpublish(ev.id)}
                                                disabled={String(ev.status).toUpperCase() === 'DRAFT'}
                                            >
                                                Unpublish
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(ev.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && filteredEvents.length === 0 && (
                    <p className="empty-state">No events found.</p>
                )}
            </div>

            {/* View Modal */}
            {showViewModal && selectedEvent && (
                <div className="modal modal-overlay">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Event Details</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6"><strong>ID:</strong> {selectedEvent.id}</div>
                                    <div className="col-md-6"><strong>Title:</strong> {selectedEvent.title}</div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6"><strong>Status:</strong> {selectedEvent.status}</div>
                                    <div className="col-md-6"><strong>Org Email:</strong> {selectedEvent.organisationEmail}</div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6"><strong>Start:</strong> {selectedEvent.startDate ? new Date(selectedEvent.startDate).toLocaleString() : '-'}</div>
                                    <div className="col-md-6"><strong>End:</strong> {selectedEvent.endDate ? new Date(selectedEvent.endDate).toLocaleString() : '-'}</div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6"><strong>Location:</strong> {selectedEvent.location}</div>
                                    <div className="col-md-6"><strong>Participants:</strong> {selectedEvent.currentVolunteers}/{selectedEvent.maxVolunteers}</div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12"><strong>Description:</strong><br/>{selectedEvent.description}</div>
                                </div>
                                {selectedEvent.imageUrl && (
                                    <div className="row mt-3">
                                        <div className="col-12">
                                            <img src={selectedEvent.imageUrl} alt="Event" style={{ maxWidth: '100%', borderRadius: 8 }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}