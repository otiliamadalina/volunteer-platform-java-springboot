import React, { useState, useEffect } from "react";
import "../../styles/main.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ParticipationHistory() {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Rămâne neschimbat, deoarece endpoint-ul "joined" este în EventController
                const response = await axios.get("http://localhost:8080/api/org/events/joined", { withCredentials: true });

                const now = new Date();
                const pastEvents = response.data.filter(event => {
                    const endDate = new Date(event.endDate);
                    return endDate < now;
                });

                setEvents(pastEvents);
                setError(null);
            } catch (err) {
                setError("Error fetching events. Please try again later.");
                console.error("Error fetching joined events:", err);
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [navigate]);

    const formatDateTime = (dateStr) => new Date(dateStr).toLocaleString();

    const handleView = (event) => {
        setSelectedEvent(event);
        setShowViewModal(true);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
        setShowViewModal(false);
    };

    const handleDelete = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event from your history?")) {
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:8080/api/org/participationHistory/${eventId}`, {
                withCredentials: true
            });

            if (response.status === 200) {
                setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
                setError(null);
            } else {
                throw new Error("Failed to delete event from history.");
            }
        } catch (e) {
            console.error("Delete failed:", e);
            setError(e.message || "Failed to delete event from history.");
        }
    };

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="card" style={{ marginTop: 20 }}>Loading participation history...</div>;
    }

    if (error) {
        return <div className="card" style={{ marginTop: 20, color: 'red' }}>{error}</div>;
    }

    return (
        <div className="card manage-card">
            <h3>Participation History</h3>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search past events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control search-input"
                />
            </div>

            <div className="table-container">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Location</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                            <tr key={event.id}>
                                <td>{event.title}</td>
                                <td>{event.location}</td>
                                <td>{formatDateTime(event.startDate)}</td>
                                <td>{formatDateTime(event.endDate)}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-primary me-2"
                                        onClick={() => handleView(event)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(event.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No past events to display.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {showViewModal && selectedEvent && (
                <div className="modal modal-overlay">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Event Details</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Title:</strong> {selectedEvent.title}</p>
                                <p><strong>Location:</strong> {selectedEvent.location}</p>
                                <p><strong>Start:</strong> {formatDateTime(selectedEvent.startDate)}</p>
                                <p><strong>End:</strong> {formatDateTime(selectedEvent.endDate)}</p>
                                <p><strong>Description:</strong> {selectedEvent.description}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}