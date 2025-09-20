import React, { useEffect, useState } from "react";
import "../../styles/main.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function JoinedEvents() {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJoinedEvents = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/org/events/joined", {
                    withCredentials: true
                });

                const now = new Date();
                const futureEvents = response.data.filter(event => {
                    const endDate = new Date(event.endDate);
                    return endDate >= now;
                });

                setEvents(futureEvents);
                setError(null);
            } catch (err) {
                setError("Error fetching events. Please try again later.");
                console.error("Failed to fetch joined events", err);
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchJoinedEvents();
    }, [navigate]);

    const formatDateTime = (dateStr) => new Date(dateStr).toLocaleString();

    const handleUnjoin = async (eventId) => {
        if (!eventId) {
            console.error("Event ID is undefined, cannot unjoin.");
            return;
        }

        try {
            await axios.post(`http://localhost:8080/api/org/events/${eventId}/unjoin`, {}, {
                withCredentials: true
            });
            setEvents(prev => prev.filter(ev => ev.id !== eventId));
            setError(null);
        } catch (e) {
            console.error("Failed to unjoin event", e);
            setError(e.response?.data?.error || "Failed to unjoin event.");
        }
    };

    const handleView = (event) => {
        setSelectedEvent(event);
        setShowViewModal(true);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
        setShowViewModal(false);
    };

    const filteredEvents = events.filter(ev =>
        ev.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="card" style={{ marginTop: 20 }}>Loading your events...</div>;
    }

    if (error) {
        return <div className="card" style={{ marginTop: 20, color: 'red' }}>{error}</div>;
    }

    return (
        <div className="card notify-manage-card">
            <h3>My Joined Events</h3>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search events..."
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
                                        onClick={() => handleUnjoin(event.id)}
                                    >
                                        Unjoin
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No current or future joined events.</td>
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