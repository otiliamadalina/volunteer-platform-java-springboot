import React from "react";
import { Outlet } from "react-router-dom";
import AdminLeftPanel from "./admin-left-panel";
import "../../styles/admin.css";
import "../../styles/main.css";

export default function AdminLayout() {
    return (
        <div className="dashboard-wrapper">
            <AdminLeftPanel />
            <div className="dashboard-main">
                <Outlet />
            </div>
        </div>
    );
}


