import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/home.css";
import "../../styles/events.css";

export function Home() {
    const [latestEvents, setLatestEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const defaultImages = [
        "/assets/motivational-1.png",
        "/assets/motivational-3.jpg",
        "/assets/motivational-2.jpg",
        "/assets/motivational-4.png",
    ];

    const fetchLatestEvents = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8080/api/org/public/events");
            const allEvents = Array.isArray(res.data) ? res.data : [];

            // filtram doar evenimentele neexpirate
            const upcomingEvents = allEvents.filter(ev => new Date(ev.endDate) >= new Date());

            // luan doar primele 3
            const firstThreeEvents = upcomingEvents.slice(0, 3);

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

    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: "linear"
    };

    if (loading) return <div className="loading-container"><p>Loading events...</p></div>;
    if (error) return <div className="error-container"><p>{error}</p></div>;

    return (
        <>
            <div className="scrolling-banner">
                <div className="scrolling-track wrapper">
                    {Array(7).fill("Together We Can – VOLUNTEERS WANTED").map((text, index) => (
                        <span key={index} className="scrolling-text">{text}</span>
                    ))}
                </div>
            </div>

            <section className="carousel-section">
                <Slider {...carouselSettings}>
                    {defaultImages.map((src, index) => (
                        <div key={index} className="carousel-slide">
                            <img src={src} alt={`Default Image ${index + 1}`} />
                        </div>
                    ))}
                </Slider>
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
                                    <img
                                        src={`http://localhost:8080${ev.imageUrl}`}
                                        alt={ev.title}
                                        className="event-image"
                                    />
                                ) : (
                                    <div className="event-image-placeholder">No Image Available</div>
                                )}
                                <div className="event-content">
                                    <h3 className="event-title">{ev.title}</h3>
                                    <p className="event-location"><strong>Location:</strong> {ev.location}</p>
                                    <p className="event-description">
                                        {ev.description ? ev.description.substring(0, 100) + "..." : "No description available."}
                                    </p>
                                    <div className="event-info-bottom"></div>
                                    <Link to="/events" className="event-details-btn">View More</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="hero spaced-section">
                <h1>Make a Difference Today</h1>
                <p>Join our community of volunteers and help build a better world.</p>
                <div className="hero-buttons">
                    <Link to="/volunteerOrOrg" className="btn nav-btn-login me-2">Get Started</Link>
                    <Link to="/events" className="btn nav-btn-login me-2">Explore Events</Link>
                </div>
            </section>
        </>
    );
}
