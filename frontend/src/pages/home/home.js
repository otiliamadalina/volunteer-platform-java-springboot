import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import "../../styles/home.css";
import "../../styles/events.css"; // Import the events CSS for the card styling

export function Home() {
    const [latestEvents, setLatestEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchLatestEvents = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8080/api/org/public/events"); // This endpoint should return all events or be updated to return a limited number
            // Filter the first 3 events from the response
            const firstThreeEvents = Array.isArray(res.data) ? res.data.slice(0, 3) : [];
            setLatestEvents(firstThreeEvents);
            setError(null);
        } catch (e) {
            console.error("Error fetching latest events:", e);
            setError(e.message || "Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLatestEvents();
    }, []);

    // Placeholder data and useEffect are not needed anymore as we are fetching events
    const [ngoImages, setNgoImages] = useState([]);
    useEffect(() => {
        // Your logic for fetching NGO images here
    }, []);


    if (loading) return <div className="loading-container"><p>Loading events...</p></div>;
    if (error) return <div className="error-container"><p>{error}</p></div>;

    return (
        <>
            <div className="scrolling-banner">
                <div className="scrolling-track wrapper">
                    <span className="scrolling-text">Together We Can – VOLUNTEERS WANTED</span>
                    <span className="scrolling-text">Together We Can – VOLUNTEERS WANTED</span>
                    <span className="scrolling-text">Together We Can – VOLUNTEERS WANTED</span>
                    <span className="scrolling-text">Together We Can – VOLUNTEERS WANTED</span>
                    <span className="scrolling-text">Together We Can – VOLUNTEERS WANTED</span>
                    <span className="scrolling-text">Together We Can – VOLUNTEERS WANTED</span>
                    <span className="scrolling-text">Together We Can – VOLUNTEERS WANTED</span>
                </div>
            </div>


            <section className="hero spaced-section">
                <h1>Make a Difference Today</h1>
                <p>Join our community of volunteers and help build a better world.</p>
                <div className="hero-buttons">
                    <Link to="/volunteerOrOrg" className="btn nav-btn-login me-2 ">Get Started</Link>
                    <Link to="/events" className="btn nav-btn-login me-2 ">Explore Events</Link>
                </div>
            </section>


            <section className="latest-events-section spaced-section">
                <h2>Latest Events</h2>
                {latestEvents.length === 0 ? (
                    <p className="events-empty">No upcoming events yet. Check back soon!</p>
                ) : (
                    <div className="events-grid">
                        {latestEvents.map((ev) => (
                            <div key={ev.id} className="event-card">
                                {ev.imageUrl ? (
                                    <img src={`http://localhost:8080${ev.imageUrl}`} alt={ev.title} className="event-image"/>
                                ) : (
                                    <div className="event-image-placeholder">No Image Available</div>
                                )}
                                <div className="event-content">
                                    <h3 className="event-title">{ev.title}</h3>
                                    <p className="event-location"><strong>Location:</strong> {ev.location}</p>
                                    <p className="event-description">{ev.description.substring(0, 100)}...</p>
                                    <div className="event-info-bottom">
                                    </div>
                                    <Link to="/events" className="event-details-btn">View More</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>


        </>
    );
}