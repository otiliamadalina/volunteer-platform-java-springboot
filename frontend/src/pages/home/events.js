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

    const role = useMemo(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("role");
        }
        return null;
    }, []);

    const fetchPublicEvents = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/org/public/events", {
                method: "GET",
                credentials: "include"
            });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const data = await res.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e.message || "Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    const fetchJoinedEvents = async () => {
        if (role === "VOLUNTEER") {
            try {
                const res = await fetch("http://localhost:8080/api/org/events/joined", {
                    method: "GET",
                    credentials: "include"
                });
                if (res.ok) {
                    const data = await res.json();
                    const ids = data.map(event => event.id);
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

            await fetchPublicEvents();
            await fetchJoinedEvents();
        } catch (e) {
            alert(e.message || "Failed to join event");
        }
    };

    const handleUnjoin = async (eventId) => {
        try {
            const res = await fetch(`http://localhost:8080/api/org/events/${eventId}/unjoin`, {
                method: "POST",
                credentials: "include"
            });
            if (!res.ok) {
                const t = await res.text();
                throw new Error(t || `HTTP ${res.status}`);
            }

            await fetchPublicEvents();
            await fetchJoinedEvents();
        } catch (e) {
            alert(e.message || "Failed to unjoin event");
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
                                <h3 className="event-title">{ev.title}</h3>>
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
                                <p><strong>Organised by:</strong> {selectedEvent.organisationEmail}</p>
                            </div>
                        )}
                        <button className="modal-close-btn" onClick={() => setOpenModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}