import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/notify.css";
import {useNavigate} from "react-router-dom";

export default function NotifyVolunteers() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState({});
    const [status, setStatus] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filter, setFilter] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/orgs/events/with-volunteers", {
                    withCredentials: true,
                });
                setEvents(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch events:", err);
                setError("Failed to fetch events. Please try again.");
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleMessageChange = (eventId, volunteerId, value) => {
        setMessage(prev => ({
            ...prev,
            [`${eventId}-${volunteerId}`]: value,
        }));
    };

    const handleSendMessage = async (eventId, volunteerId) => {
        const text = message[`${eventId}-${volunteerId}`];
        if (!text || text.trim() === "") {
            setStatus(prev => ({
                ...prev,
                [`${eventId}-${volunteerId}`]: { message: "Message cannot be empty.", type: "error" }
            }));
            return;
        }

        setIsSubmitting(true);
        setStatus(prev => ({ ...prev, [`${eventId}-${volunteerId}`]: { message: "Sending...", type: "info" } }));

        try {
            await axios.post(
                `http://localhost:8080/api/notifications/send-to-volunteer`,
                { eventId, volunteerId, text },
                {
                    withCredentials: true
                }
            );
            setStatus(prev => ({
                ...prev,
                [`${eventId}-${volunteerId}`]: { message: "Message sent successfully!", type: "success" }
            }));
            setMessage(prev => ({ ...prev, [`${eventId}-${volunteerId}`]: "" }));
        } catch (err) {
            console.error("Failed to send message:", err);
            setStatus(prev => ({
                ...prev,
                [`${eventId}-${volunteerId}`]: { message: "Failed to send message. Please try again.", type: "error" }
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(filter) ||
        event.volunteers.some(v => v.fullName.toLowerCase().includes(filter))
    );

    if (loading) {
        return <div className="card manage-card"><p>Loading events...</p></div>;
    }

    if (error) {
        return <div className="card manage-card"><p className="text-red-500">{error}</p></div>;
    }

    return (
        <div className="card manage-card">
            <h3>Notify Volunteers</h3>
            <p>Send personalized messages to volunteers signed up for your events.</p>

            <div className="search-actions-row">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Filter by event or volunteer name..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value.toLowerCase())}
                />
                <button
                    className="notify-btn notify-btn-secondary"
                    onClick={() => navigate("/organisationDashboard/sentMessages")}
                >
                    View Sent Messages
                </button>
            </div>



            {filteredEvents.length === 0 ? (
                <p className="empty-state">No matching events or volunteers found.</p>
            ) : (
                <div className="events-list">
                    {filteredEvents.map(event => (
                        <div key={event.id} className="event-item">
                            <h4>Event: {event.title}</h4>

                            {event.volunteers && event.volunteers.length > 0 ? (
                                <ul className="volunteers-list">
                                    {event.volunteers.map(volunteer => (
                                        <li key={volunteer.id} className="volunteer-item">
                                            <p>Name: {volunteer.fullName} ({volunteer.email})</p>
                                            <div className="message-form">
                                                <textarea
                                                    className="message-textarea"
                                                    placeholder="Write a message..."
                                                    value={message[`${event.id}-${volunteer.id}`] || ""}
                                                    onChange={(e) => handleMessageChange(event.id, volunteer.id, e.target.value)}
                                                    disabled={isSubmitting}
                                                ></textarea>
                                                <button
                                                    className="notify-btn notify-btn-primary"
                                                    onClick={() => handleSendMessage(event.id, volunteer.id)}
                                                    disabled={isSubmitting}
                                                >
                                                    Send
                                                </button>
                                                {status[`${event.id}-${volunteer.id}`] && (
                                                    <div className={`status-message ${status[`${event.id}-${volunteer.id}`].type}`}>
                                                        {status[`${event.id}-${volunteer.id}`].message}
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="empty-state">No volunteers are signed up for this event.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
