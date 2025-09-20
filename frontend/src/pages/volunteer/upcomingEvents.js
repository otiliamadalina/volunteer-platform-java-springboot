import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/volunteer.css";
import { useNavigate } from "react-router-dom";

export default function UpcomingEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUpcomingEvents = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/org/events/joined", {
                    withCredentials: true
                });

                const now = new Date();
                const filteredEvents = response.data.filter(event => {
                    const startDate = new Date(event.startDate);
                    return startDate > now;
                });

                setEvents(filteredEvents);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch upcoming events:", err);
                setError("Could not load upcoming events. Please try again later.");
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUpcomingEvents();
    }, [navigate]);


    if (loading) return <p className="upcoming-loading">Loading upcoming events...</p>;
    if (error) return <p className="upcoming-error">{error}</p>;

    return (
        <div className="upcoming-card-list">
            {events.map((event, index) => (
                <div key={event.id} className="upcoming-event-item">
                    <p className="upcoming-event-title">{index + 1}. {event.title}</p>
                </div>

            ))}
        </div>


    );
}