import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allowedRole, children }) {
    const role = localStorage.getItem("role");

    if (role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}
