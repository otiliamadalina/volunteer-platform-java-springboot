import React, { useEffect, useState } from "react";

export default function JoinedEvents() {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    useEffect(() => {
        const fetchJoinedEvents = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/org/events/joined", {
                    method: "GET",
                    credentials: "include"
                });
                const data = await res.json();
                setEvents(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error("Failed to fetch joined events", e);
            }
        };
        fetchJoinedEvents();
    }, []);

    const filteredEvents = events.filter(ev =>
        ev.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDateTime = (dateStr) => new Date(dateStr).toLocaleString();

    const handleUnjoin = async (eventId) => {
        try {
            const res = await fetch(`http://localhost:8080/api/org/events/${eventId}/unjoin`, {
                method: "POST",
                credentials: "include"
            });
            if (!res.ok) throw new Error(await res.text());
            setEvents(prev => prev.filter(ev => ev.id !== eventId));
        } catch (e) {
            alert(e.message || "Failed to unjoin event");
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

    return (
        <div className="card manage-card">
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
                    {filteredEvents.map(event => (
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
                    ))}
                    </tbody>
                </table>
            </div>

            {filteredEvents.length === 0 && (
                <p className="empty-state">You haven't joined any events yet.</p>
            )}

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
