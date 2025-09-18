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
        const fetchAndArchiveEvents = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/org/events/joined", { withCredentials: true });

                const now = new Date();
                const allJoinedEvents = response.data;

                const eventsToArchive = allJoinedEvents.filter(event => {
                    const endDate = new Date(event.endDate);
                    return endDate < now && event.participationStatus !== "ARCHIVED";
                });

                if (eventsToArchive.length > 0) {
                    console.log(`Found ${eventsToArchive.length} events to archive. Sending requests.`);
                    await Promise.all(eventsToArchive.map(event =>
                        axios.put(`http://localhost:8080/api/org/events/${event.id}/archive`, {}, { withCredentials: true })
                    ));
                    console.log("All archive requests sent successfully.");
                }

                const pastEventsForDisplay = allJoinedEvents.filter(event => {
                    const endDate = new Date(event.endDate);
                    return endDate < now && event.participationStatus !== "ARCHIVED";
                });

                setEvents(pastEventsForDisplay);
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

        fetchAndArchiveEvents();
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