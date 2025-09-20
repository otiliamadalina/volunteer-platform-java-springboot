import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/volunteer.css";

export default function VolunteerCalendar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
             
                
                const res = await axios.get("http://localhost:8080/api/org/events/joined", {
                    withCredentials: true
                });
                setEvents(res.data);
            } catch (error) {
                console.error("Failed to fetch events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const tileContent = ({ date, view }) => {
        if (view === "month") {
            const hasEvent = events.some(event => {
                const eventDate = new Date(event.startDate);
                return eventDate.getDate() === date.getDate() &&
                    eventDate.getMonth() === date.getMonth() &&
                    eventDate.getFullYear() === date.getFullYear();
            });

            return hasEvent ? <div className="event-marker"></div> : null;
        }
    };

    if (loading) return <p>Loading calendar...</p>;

    return (
        <div className="volunteer-calendar-wrapper">
            <Calendar
                tileContent={tileContent}
                className="react-calendar-custom"
                locale="en-US"
            />

        </div>
    );
}