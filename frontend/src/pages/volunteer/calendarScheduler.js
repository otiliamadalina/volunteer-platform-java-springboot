import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarScheduler() {
    return (
        <div className="card" style={{ marginTop: 20 }}>
            <h3>Calendar (Scheduler)</h3>
            <Calendar className="admin-calendar" locale="en-GB" />
        </div>
    );
}


