import React, { useEffect, useMemo, useState } from "react";
import "../../styles/events.css";
import axios from 'axios';

export default function EventsPublic() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [modalText, setModalText] = useState("");
    const [joinedEvents, setJoinedEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const role = useMemo(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("role");
        }
        return null;
    }, []);

    const fetchPublicEvents = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8080/api/org/public/events", {
                withCredentials: true
            });
            setEvents(Array.isArray(res.data) ? res.data : []);
            setError(null);
        } catch (e) {
            setError(e.message || "Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    const fetchJoinedEvents = async () => {
        if (role === "VOLUNTEER") {
            try {
                const res = await axios.get("http://localhost:8080/api/org/events/joined", {
                    withCredentials: true
                });
                if (res.status === 200) {
                    const ids = res.data.map(event => event.id);
                    setJoinedEvents(ids);
                }
            } catch (e) {
                console.error("Failed to fetch joined events", e);
            }
        }
    };

    useEffect(() => {
        fetchPublicEvents();
        fetchJoinedEvents();
    }, [role]);

    const handleJoin = async (eventId) => {
        if (joinedEvents.includes(eventId)) {
            return;
        }
        try {
            const res = await axios.post(`http://localhost:8080/api/org/events/${eventId}/join`, {}, {
                withCredentials: true
            });

            if (res.status === 200) {
                setJoinedEvents(prev => [...prev, eventId]);

                setEvents(prevEvents =>
                    prevEvents.map(event =>
                        event.id === eventId
                            ? { ...event, currentVolunteers: res.data.currentVolunteers }
                            : event
                    )
                );
                setStatusMessage("Successfully joined the event!");
                setIsSuccess(true);
            }
        } catch (e) {
            setStatusMessage(e.response?.data?.error || "Failed to join event.");
            setIsSuccess(false);
        } finally {
            setShowStatusModal(true);
        }
    };

    const handleUnjoin = async (eventId) => {
        try {
            const res = await axios.post(`http://localhost:8080/api/org/events/${eventId}/unjoin`, {}, {
                withCredentials: true
            });

            if (res.status === 200) {
                setJoinedEvents(prev => prev.filter(id => id !== eventId));

                setEvents(prevEvents =>
                    prevEvents.map(event =>
                        event.id === eventId
                            ? { ...event, currentVolunteers: Math.max(0, event.currentVolunteers - 1) }
                            : event
                    )
                );

                setStatusMessage("Successfully unjoined the event.");
                setIsSuccess(true);
            }

        } catch (e) {
            setStatusMessage(e.response?.data?.error || "Failed to unjoin event.");
            setIsSuccess(false);
        } finally {
            setShowStatusModal(true);
        }
    };

    if (loading) return <div className="events-loading"><p>Loading events…</p></div>;
    if (error) return <div className="events-error"><p>{error}</p></div>;

    return (
        <div className="events-container">
            <h1 className="events-title">Upcoming Events</h1>
            {events.length === 0 ? (
                <p className="events-empty">No events yet.</p>
            ) : (
                <div className="events-grid">
                    {events.map((ev) => (
                        <div key={ev.id} className="event-card">
                            {ev.imageUrl ? (
                                <img src={`http://localhost:8080${ev.imageUrl}`} alt={ev.title}
                                     className="event-image"/>
                            ) : (
                                <div className="event-image-placeholder"/>
                            )}
                            <div className="event-content">
                                <h3 className="event-title">{ev.title}</h3>
                                <p className="event-location"><strong>Location:</strong> {ev.location}</p>
                                <div className="event-description-container">
                                    <p className="event-description">{ev.description}</p>
                                    <button
                                        onClick={() => {
                                            setModalText(ev.description);
                                            setSelectedEvent(ev);
                                            setOpenModal(true);
                                        }}
                                        className="event-view-more-btn"
                                    >
                                        View More
                                    </button>
                                </div>

                                {role === "VOLUNTEER" && (
                                    <div className="event-volunteer-section">
                                        <span>{ev.currentVolunteers || 0}/{ev.maxVolunteers}</span>
                                        <button
                                            onClick={() =>
                                                joinedEvents.includes(ev.id)
                                                    ? handleUnjoin(ev.id)
                                                    : handleJoin(ev.id)
                                            }
                                            className="event-join-btn"
                                            disabled={ev.currentVolunteers >= ev.maxVolunteers && !joinedEvents.includes(ev.id)}
                                        >
                                            {joinedEvents.includes(ev.id) ? "Unjoin" : "Join Event"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {openModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <h2>Event Details</h2>
                        <p style={{whiteSpace: "pre-line"}}>{modalText}</p>
                        {role === "VOLUNTEER" && selectedEvent && (
                            <div className="event-dates">
                                <p><strong>Start Date:</strong> {new Date(selectedEvent.startDate).toLocaleString()}</p>
                                <p><strong>End Date:</strong> {new Date(selectedEvent.endDate).toLocaleString()}</p>
                                <p><strong>Organised by:</strong> {selectedEvent.organisationName}</p>
                            </div>
                        )}
                        <button className="modal-close-btn" onClick={() => setOpenModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {showStatusModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <h2 className={isSuccess ? "text-green-600" : "text-red-600"}>
                            {isSuccess ? "Success" : "Error"}
                        </h2>
                        <p>{statusMessage}</p>
                        <button onClick={() => setShowStatusModal(false)} className="modal-close-btn">
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}