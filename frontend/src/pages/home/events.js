import React, { useEffect, useMemo, useState } from "react";
import "../../styles/events.css";

export default function EventsPublic() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
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
                copy[idx] = { ...copy[idx], currentVolunteers: data.currentVolunteers };
                return copy;
            });
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
                                <img src={`http://localhost:8080${ev.imageUrl}`} alt={ev.title} className="event-image" />
                            ) : (
                                <div className="event-image-placeholder" />
                            )}
                            <div className="event-content">
                                <h3 className="event-title">{ev.title}</h3>
                                <div className="event-description-container">
                                    <p className="event-description">{truncate(ev.description, 140)}</p>
                                    {ev.description && ev.description.length > 140 && (
                                        <button
                                            onClick={() => alert(ev.description)}
                                            className="event-view-more-btn"
                                        >
                                            View More
                                        </button>
                                    )}
                                </div>

                                {role === "VOLUNTEER" && (
                                    <div className="event-volunteer-section">
                                        <span>{ev.currentVolunteers || 0}/{ev.maxVolunteers}</span>
                                        <button onClick={() => handleJoin(ev.id, idx)} className="event-join-btn">
                                            Join Event
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
