import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/");
        }
    }, []);

    return (
        <div className="admin-dashboard">
            <h1>Welcome, Admin</h1>

        </div>
    );
}
