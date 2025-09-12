import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLeftPanel from "./adminLeftPanel";
import "../../styles/admin.css"
import "../../styles/main.css"

export default function ManageEvents() {
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/");
        }
    }, []);

    return (
        <div className="dashboard-wrapper">
            <AdminLeftPanel />
        </div>
    );
}