import React from "react";
import "../../styles/admin.css";
import "../../styles/main.css";

export default function VolunteerDashboard() {
    return (
        <>
            <h1>Volunteer Dashboard</h1>
            <div className="card" style={{ marginTop: 20 }}>
                <h3>Welcome</h3>
                <p>Quick overview of your upcoming events and activity.</p>
            </div>
        </>
    );
}