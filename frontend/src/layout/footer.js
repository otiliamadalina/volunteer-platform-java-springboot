import React from "react";
import {Link} from "react-router-dom";
import "../styles/navbar.css";
import "../styles/footer.css"


export default function Footer() {
    return (
<>
        <div className="footer-image-wrapper">
            <img src="/assets/multicolour-hands.jpg" alt="Footer Banner" className="footer-image" />
        </div>

        <footer className="footer bg-custom text-light" style={{ margin: 0, paddingTop: 16, paddingBottom: 16 }}>
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <span className="footer-text">&copy; {new Date().getFullYear()} Volunteer Sphere</span>
            </div>
        </footer>
</>
    );
}