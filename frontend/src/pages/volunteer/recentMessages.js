import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/volunteer.css";

export default function RecentMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/notifications/for-volunteer", {
                    withCredentials: true
                });

                // Get the last 3 messages and mark read status
                const recentMessages = res.data.slice(0, 3).map(n => ({
                    ...n,
                    isRead: Boolean(n.isRead)
                }));

                setMessages(recentMessages);
            } catch (error) {
                console.error("Failed to fetch recent messages:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    if (loading) return <p>Loading recent messages...</p>;

    return (
        <div className="recent-messages-list">
            {messages.length === 0 ? (
                <p className="recent-empty">No recent messages.</p>
            ) : (
                <ul className="recent-messages-ul">
                    {messages.map(note => (
                        <li key={note.id} className={`recent-message-card ${note.isRead ? 'read' : 'unread'}`}>
                            <div className="message-content">
                                <p className="message-text">{note.text}</p>
                                <span className="message-date">{new Date(note.sentAt).toLocaleDateString()}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <Link to="/volunteerDashboard/joinedEventsDetails" className="view-all-link">
                View all messages
            </Link>
        </div>

    );
}