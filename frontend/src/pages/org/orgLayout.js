import React from "react";
import { Outlet } from "react-router-dom";
import OrgLeftPanel from "./orgLeftPanel";
import "../../styles/admin.css";
import "../../styles/main.css";

export default function OrgLayout() {
    return (
        <div className="dashboard-wrapper">
            <OrgLeftPanel />
            <div className="dashboard-main">
                <Outlet />
            </div>
        </div>
    );
}


