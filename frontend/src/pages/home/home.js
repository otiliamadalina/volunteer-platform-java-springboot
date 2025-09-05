import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import "../../styles/home.css";

export function Home() {
    const [users, setUsers] = useState([]); // cream o lista goala de users

    const {id} = useParams();

    const [ngoImages, setNgoImages] = useState([]);

    useEffect(() => {
        fetchNgoImages();
    }, []);

    const fetchNgoImages = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/ngos/images");
            setNgoImages(response.data);
        } catch (error) {
            console.error("Error fetching NGO images:", error);
        }
    };


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

    <div className="hero-images spaced-section">
        {ngoImages.length > 0 ? (
            ngoImages.map((imgUrl, index) => (
                <img key={index} src={imgUrl} alt={`NGO image ${index + 1}`} />
            ))
        ) : (
            <p className="no-events-text">Sorry. No events available at the moment.</p>
        )}
    </div>


    <section className="hero spaced-section">
            <h1>Make a Difference Today</h1>
            <p>Join our community of volunteers and help build a better world.</p>
            <div className="hero-buttons">
                <Link to="/volunteerOrOrg" className="btn nav-btn-login me-2 ">Get Started</Link>
                <Link to="/events" className="btn nav-btn-login me-2 ">Explore Events</Link>
            </div>
        </section>





</>
    );
}
