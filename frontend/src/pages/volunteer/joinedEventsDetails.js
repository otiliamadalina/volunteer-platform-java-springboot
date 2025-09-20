import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/volunteer.css";

export default function JoinedEventsDetails() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchNotifications = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/notifications/for-volunteer", {
                withCredentials: true
            });

            console.log("Fetched notifications:", res.data);

            const notificationsWithBoolean = res.data.map(n => ({
                ...n,
                isRead: Boolean(n.read)
            }));

            setNotifications(notificationsWithBoolean);
            setError(null);
        } catch (e) {
            console.error("Failed to fetch notifications", e);
            setError("Could not load messages.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);




    const handleMarkAsRead = async (noteId, event) => {
        if (event) event.preventDefault();

        try {
            await axios.put(
                `http://localhost:8080/api/notifications/mark-as-read/${noteId}`,
                {},
                { withCredentials: true }
            );

            setNotifications(prev =>
                prev.map(note =>
                    note.id === noteId ? { ...note, isRead: true } : note
                )
            );

            setError("");
        } catch (e) {
            console.error("Failed to mark message as read", e);
            setError("Could not mark message as read.");
        }
    };




    if (loading) return <p>Loading messages...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="volunteer-messages">
            <h2>Messages from Organisers</h2>
            {notifications.length === 0 ? (
                <p>No messages received yet.</p>
            ) : (
                <ul className="message-list">
                    {notifications.map((note) => (
                        <li key={note.id} className="message-card">
                            <h4>Event: {note.eventTitle}</h4>
                            <p>{note.text}</p>
                            <div className="message-meta">
                                <div className="message-date-wrapper">
                                    <span className="message-date">Received: {new Date(note.sentAt).toLocaleString()}</span>
                                </div>

                                {note.isRead ? (
                                    <span className="read-label">Read</span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={(event) => handleMarkAsRead(note.id, event)}
                                        className="read-button"
                                    >
                                        Mark as Read
                                    </button>
                                )}


                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
