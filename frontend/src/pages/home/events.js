import React, { useEffect, useMemo, useState } from "react";
import "../../styles/events.css";

export default function EventsPublic() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [modalText, setModalText] = useState("");
    const [joinedEvents, setJoinedEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const role = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("role") : null), []);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetch("http://localhost:8080/api/org/public/events", {
                    method: "GET",
                    credentials: "include"
                });
                if (!res.ok) {
                    const t = await res.text();
                    throw new Error(t || `HTTP ${res.status}`);
                }
                const data = await res.json();
                setEvents(Array.isArray(data) ? data : []);
            } catch (e) {
                setError(e.message || "Failed to load events");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleJoin = async (eventId, idx) => {
        if (joinedEvents.includes(eventId)) return;

        try {
            const res = await fetch(`http://localhost:8080/api/org/events/${eventId}/join`, {
                method: "POST",
                credentials: "include"
            });
            if (!res.ok) {
                const t = await res.text();
                throw new Error(t || `HTTP ${res.status}`);
            }
            const data = await res.json();
            setEvents(prev => {
                const copy = [...prev];
                copy[idx] = {...copy[idx], currentVolunteers: data.currentVolunteers};
                return copy;
            });

            setJoinedEvents(prev => [...prev, eventId]);

        } catch (e) {
            alert(e.message || "Failed to join event");
        }
    };

    const truncate = (text, n = 120) => (!text ? "" : text.length > n ? `${text.slice(0, n).trim()}…` : text);

    if (loading) return <div className="events-loading"><p>Loading events…</p></div>;
    if (error) return <div className="events-error"><p>{error}</p></div>;

    return (
        <div className="events-container">
            <h1 className="events-title">Upcoming Events</h1>
            {events.length === 0 ? (
                <p className="events-empty">No events yet.</p>
            ) : (
                <div className="events-grid">
                    {events.map((ev, idx) => (
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
                                            onClick={() => handleJoin(ev.id, idx)}
                                            className="event-join-btn"
                                            disabled={joinedEvents.includes(ev.id)}
                                        >
                                            {joinedEvents.includes(ev.id) ? "Joined" : "Join Event"}
                                        </button>

                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Custom Modal */}
            {openModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <h2>Event Details</h2>
                        <p style={{whiteSpace: "pre-line"}}>{modalText}</p>

                        {role === "VOLUNTEER" && selectedEvent && (
                            <div className="event-dates">
                                <p><strong>Start Date:</strong> {new Date(selectedEvent.startDate).toLocaleString()}</p>
                                <p><strong>End Date:</strong> {new Date(selectedEvent.endDate).toLocaleString()}</p>
                            </div>
                        )}

                        <button className="modal-close-btn" onClick={() => setOpenModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}


