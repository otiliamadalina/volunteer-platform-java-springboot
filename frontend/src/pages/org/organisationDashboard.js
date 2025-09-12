import React from "react";
import "../../styles/admin.css";
import "../../styles/main.css";

export default function OrganisationDashboard() {
    return (
        <>
            <h1>Organisation Dashboard</h1>
            <div className="card" style={{ marginTop: 20 }}>
                <h3>Welcome</h3>
                <p>Here you can manage your events and volunteers.</p>
            </div>
        </>
    );
}