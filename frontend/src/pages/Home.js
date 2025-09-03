import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import "../styles/Home.css";

export function Home() {
    const [users, setUsers] = useState([]); // cream o lista goala de users

    const {id} = useParams();

    useEffect(() => {
        loadUsers(); // cand pagina se incarca, ruleaza functia loadUsers
    }, []); // [] - ruleaza o singura data

    const loadUsers = async () => {
        const result = await axios.get("http://localhost:8080/users"); // cere lista de utilizatori
        setUsers(result.data) // ceea ce primeste de la server, pune in lista
    };

    const deleteUser = async (id) => {
        await axios.delete(`http://localhost:8080/user/${id}`);
        loadUsers();
    };

    return (
<>
    <div className="home-spacing"></div>

        {/*<section className="hero">*/}
        {/*    <h1>Make a Difference Today</h1>*/}
        {/*    <p>Join our community of volunteers and help build a better world.</p>*/}
        {/*    <div className="hero-buttons">*/}
        {/*        <Link to="/register" className="btn btn-outline-light me-3">Get Started</Link>*/}
        {/*        <Link to="/events" className="btn btn-light">Explore Events</Link>*/}
        {/*    </div>*/}
        {/*</section>*/}

    <div className="scrolling-banner">
        <div className="scrolling-track">
            <span className="scrolling-text">Together We Can – Volunteers WANTED</span>
            <span className="scrolling-text">Together We Can – Volunteers WANTED</span>
            <span className="scrolling-text">Together We Can – Volunteers WANTED</span>
            <span className="scrolling-text">Together We Can – Volunteers WANTED</span>
        </div>
    </div>






</>
    );
}
