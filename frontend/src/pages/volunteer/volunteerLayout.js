import React from "react";
import { Outlet } from "react-router-dom";
import VolunteerLeftPanel from "./volunteerLeftPanel";
import "../../styles/admin.css";
import "../../styles/main.css";

export default function VolunteerLayout() {
    return (
        <div className="dashboard-wrapper">
            <VolunteerLeftPanel />
            <div className="dashboard-main">
                <Outlet />
            </div>
        </div>
    );
}


