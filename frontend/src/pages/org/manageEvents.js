import React, { useState, useEffect } from "react";
import "../../styles/organisation.css";
import "../../styles/events.css";

export default function ManageEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            console.log("Fetching events from /api/org/events");
            const res = await fetch("http://localhost:8080/api/org/events", {
                method: "GET",
                credentials: "include",
                headers: {
                    "X-Org-Email": localStorage.getItem("email") || ""
                }
            });

            console.log("Response status:", res.status);

            if (res.ok) {
                const data = await res.json();
                console.log("Received events data:", data);
                setEvents(data);
            } else {
                const errorText = await res.text();
                console.error("Failed to fetch events:", res.status, errorText);
            }
        } catch (err) {
            console.error("Failed to fetch events:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = 
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.status.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearch;
    });

    const handleView = (event) => {
        setSelectedEvent(event);
        setShowViewModal(true);
    };

    const handleDelete = async (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                const res = await fetch(`http://localhost:8080/api/org/events/${eventId}`, {
                    method: "DELETE",
                    credentials: "include"
                });

                if (res.ok) {
                    setEvents(events.filter(e => e.id !== eventId));
                    alert("Event deleted successfully!");
                } else {
                    alert("Failed to delete event. Please try again.");
                }
            } catch (err) {
                console.error("Failed to delete event:", err);
                alert("Failed to delete event. Please try again.");
            }
        }
    };

    const handleStatusChange = async (eventId, newStatus) => {
        try {
            const res = await fetch(`http://localhost:8080/api/org/events/${eventId}/status?status=${encodeURIComponent(newStatus)}`, {
                method: "PUT",
                headers: {
                    "X-Org-Email": localStorage.getItem("email") || ""
                },
                credentials: "include"
            });

            if (res.ok) {
                setEvents(events.map(e => 
                    e.id === eventId ? { ...e, status: newStatus } : e
                ));
                alert("Event status updated successfully!");
            } else {
                alert("Failed to update event status. Please try again.");
            }
        } catch (err) {
            console.error("Failed to update event status:", err);
            alert("Failed to update event status. Please try again.");
        }
    };

    const handleCloseModal = () => {
        setShowViewModal(false);
        setSelectedEvent(null);
    };

    const formatDateTime = (dateTimeString) => {
        return new Date(dateTimeString).toLocaleString();
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'DRAFT': return 'status-draft';
            case 'PUBLISHED': return 'status-published';
            case 'CANCELLED': return 'status-cancelled';
            case 'COMPLETED': return 'status-completed';
            default: return 'status-draft';
        }
    };

    if (loading) {
        return (
            <div className="card manage-card">
                <h3>Manage Events</h3>
                <p>Loading events...</p>
            </div>
        );
    }

    return (
        <div className="card manage-card">
            <h3>Manage Events</h3>
            
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
                            <th>ID</th>
                            <th>Title</th>
                            <th>Location</th>
                            <th>Start Date</th>
                            <th>Status</th>
                            <th>Volunteers</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map(event => (
                            <tr key={event.id}>
                                <td>{event.id}</td>
                                <td>{event.title}</td>
                                <td>{event.location}</td>
                                <td>{formatDateTime(event.startDate)}</td>
                                <td>
                                    <span className={`event-status ${getStatusBadgeClass(event.status)}`}>
                                        {event.status}
                                    </span>
                                </td>
                                <td>{event.currentVolunteers}/{event.maxVolunteers}</td>
                                <td>
                                    <button 
                                        className="btn btn-sm btn-outline-primary me-2" 
                                        onClick={() => handleView(event)}
                                    >
                                        View
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-outline-warning me-2" 
                                        onClick={() => handleStatusChange(event.id, 'PUBLISHED')}
                                        disabled={event.status === 'PUBLISHED'}
                                    >
                                        Publish
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-outline-danger" 
                                        onClick={() => handleDelete(event.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredEvents.length === 0 && (
                <p className="empty-state">
                    No events found matching your criteria.
                </p>
            )}

            {/* View Modal */}
            {showViewModal && selectedEvent && (
                <div className="modal modal-overlay">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Event Details</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                {selectedEvent.imageUrl && (
                                    <div className="row mb-3">
                                        <div className="col-12">
                                            <img
                                                src={`http://localhost:8080${selectedEvent.imageUrl}`}
                                                alt={selectedEvent.title}
                                                style={{
                                                    width: "100%",
                                                    maxHeight: "300px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px"
                                                }}
                                            />

                                        </div>
                                    </div>
                                )}
                                <div className="row">
                                    <div className="col-md-6">
                                        <strong>ID:</strong> {selectedEvent.id}
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Title:</strong> {selectedEvent.title}
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <strong>Location:</strong> {selectedEvent.location}
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Status:</strong> 
                                        <span className={`event-status ${getStatusBadgeClass(selectedEvent.status)} ms-2`}>
                                            {selectedEvent.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <strong>Start Date:</strong> {formatDateTime(selectedEvent.startDate)}
                                    </div>
                                    <div className="col-md-6">
                                        <strong>End Date:</strong> {formatDateTime(selectedEvent.endDate)}
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <strong>Max Volunteers:</strong> {selectedEvent.maxVolunteers}
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Current Volunteers:</strong> {selectedEvent.currentVolunteers}
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12">
                                        <strong>Description:</strong>
                                        <p className="mt-1 event-description-pre">{selectedEvent.description}</p>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12">
                                        <strong>Created:</strong> {formatDateTime(selectedEvent.createdAt)}
                                    </div>
                                </div>
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


