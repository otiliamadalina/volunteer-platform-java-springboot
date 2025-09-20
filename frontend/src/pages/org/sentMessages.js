import React, {useEffect, useState} from "react";
import axios from "axios";
import "../../styles/notify.css";

export default function SentMessages() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSentMessages = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/notifications/sent-by-org", {
                    withCredentials: true
                });
                setNotifications(res.data);
            } catch (e) {
                console.error("Error fetching sent messages", e);
                setError("Could not load sent messages.");
            } finally {
                setLoading(false);
            }
        };

        fetchSentMessages();
    }, []);

    if (loading) return <p className="text-center py-4">Loading sent messages...</p>;
    if (error) return <p className="text-red-500 text-center py-4">{error}</p>;

    return (
        <div className="sent-messages-container">
            <h3 className="sent-messages-title">Sent Messages</h3>
            {notifications.length === 0 ? (
                <p className="sent-messages-empty">No messages have been sent yet.</p>
            ) : (
                <ul className="sent-message-list">
                    {notifications.map((note) => (
                        <li key={note.id ?? `${note.volunteerEmail}-${note.sentAt}`} className="sent-message-card">
                            <p className="sent-message-event"><strong>Event:</strong> {note.eventTitle}</p>
                            <p className="sent-message-recipient">
                                <strong>To:</strong> {note.volunteerName} ({note.volunteerEmail})</p>
                            <p className="sent-message-text"><strong>Message:</strong> {note.text}</p>
                            <p className="sent-message-meta">
                                <strong>Status:</strong>{" "}
                                <span className={note.read ? "status-read" : "status-unread"}>
                                 {note.read ? "READ" : "UNREAD"}
                                </span>
                            </p>

                            <p className="sent-message-meta">
                                <strong>Sent:</strong> {new Date(note.sentAt).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>

    );
}
