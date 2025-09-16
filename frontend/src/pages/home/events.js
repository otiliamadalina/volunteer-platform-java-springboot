import React, { useEffect, useMemo, useState } from "react";

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

    const truncate = (text, n = 120) => {
        if (!text) return "";
        return text.length > n ? `${text.slice(0, n).trim()}…` : text;
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                <p>Loading events…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px", color: "#b00020" }}>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
            <h1 style={{ textAlign: "center", marginBottom: 24 }}>Upcoming Events</h1>
            {events.length === 0 ? (
                <p style={{ textAlign: "center" }}>No events yet.</p>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 16,
                        alignItems: "stretch"
                    }}
                >
                    {events.map((ev, idx) => (
                        <div key={ev.id}
                             style={{
                                 border: "1px solid #eee",
                                 borderRadius: 8,
                                 overflow: "hidden",
                                 boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                 display: "flex",
                                 flexDirection: "column",
                                 background: "#fff"
                             }}
                        >
                            {ev.imageUrl ? (
                                <img
                                    src={`http://localhost:8080${ev.imageUrl}`}
                                    alt={ev.title}
                                    style={{ width: "100%", height: 160, objectFit: "cover" }}
                                />
                            ) : (
                                <div style={{ width: "100%", height: 160, background: "#f4f4f4" }} />
                            )}
                            <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
                                <h3 style={{ margin: "0 0 8px" }}>{ev.title}</h3>
                                <p style={{ margin: 0, color: "#555", flex: 1 }}>
                                    {truncate(ev.description, 140)} {ev.description && ev.description.length > 140 && (
                                    <button
                                        onClick={() => alert(ev.description)}
                                        style={{ border: "none", background: "transparent", color: "#6c63ff", cursor: "pointer", padding: 0 }}
                                    >
                                        View More
                                    </button>
                                )}
                                </p>

                                {role === "VOLUNTEER" && (
                                    <div style={{ display: "flex", alignItems: "center", marginTop: 12, gap: 8 }}>
                                        <span style={{ fontWeight: 600 }}>{ev.currentVolunteers || 0}/{ev.maxVolunteers}</span>
                                        <button
                                            onClick={() => handleJoin(ev.id, idx)}
                                            style={{
                                                marginLeft: "auto",
                                                background: "#6c63ff",
                                                color: "#fff",
                                                border: "none",
                                                padding: "8px 12px",
                                                borderRadius: 6,
                                                cursor: "pointer"
                                            }}
                                        >
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







