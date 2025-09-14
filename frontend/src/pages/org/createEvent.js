import React, { useState } from "react";

export default function CreateEvent() {
    const [form, setForm] = useState({
        title: "",
        startDate: "",
        endDate: "",
        location: "",
        maxVolunteers: "",
        description: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const isValid = () => {
        const maxVolunteersNum = Number(form.maxVolunteers);
        return (
            form.title.trim() &&
            form.startDate &&
            form.endDate &&
            form.location.trim() &&
            form.description.trim() &&
            Number.isFinite(maxVolunteersNum) && maxVolunteersNum > 0 &&
            new Date(form.startDate) < new Date(form.endDate)
        );
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isValid()) {
            setMessage("Please fill required fields correctly.");
            return;
        }
        setSubmitting(true);
        setMessage("");
        try {
            const eventData = {
                title: form.title.trim(),
                description: form.description.trim(),
                location: form.location.trim(),
                startDate: form.startDate,
                endDate: form.endDate,
                maxVolunteers: Number(form.maxVolunteers)
            };

            const res = await fetch("http://localhost:8080/api/org/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(eventData)
            });
            if (!res.ok) throw new Error("Failed to create event");
            setMessage("Event created successfully.");
            setForm({ title: "", startDate: "", endDate: "", location: "", maxVolunteers: "", description: "" });
        } catch (err) {
            setMessage("Error: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card" style={{ marginTop: 20 }}>
            <h3>Create Event</h3>
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
                <div>
                    <label htmlFor="title"><strong>Title</strong> *</label>
                    <input id="title" name="title" type="text" value={form.title} onChange={onChange} className="form-control" placeholder="e.g., Beach Cleanup" required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                        <label htmlFor="startDate"><strong>Start Date & Time</strong> *</label>
                        <input id="startDate" name="startDate" type="datetime-local" value={form.startDate} onChange={onChange} className="form-control" required />
                    </div>
                    <div>
                        <label htmlFor="endDate"><strong>End Date & Time</strong> *</label>
                        <input id="endDate" name="endDate" type="datetime-local" value={form.endDate} onChange={onChange} className="form-control" required />
                    </div>
                </div>
                <div>
                    <label htmlFor="location"><strong>Location</strong> *</label>
                    <input id="location" name="location" type="text" value={form.location} onChange={onChange} className="form-control" placeholder="City, Address or Online" required />
                </div>
                <div>
                    <label htmlFor="maxVolunteers"><strong>Maximum Volunteers Needed</strong> *</label>
                    <input id="maxVolunteers" name="maxVolunteers" type="number" min="1" step="1" value={form.maxVolunteers} onChange={onChange} className="form-control" placeholder="e.g., 25" required />
                </div>
                <div>
                    <label htmlFor="description"><strong>Description</strong> *</label>
                    <textarea id="description" name="description" rows="4" value={form.description} onChange={onChange} className="form-control" placeholder="Add details about the event" required />
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <button type="submit" className="btn btn-primary" disabled={submitting || !isValid()}>
                        {submitting ? "Creating..." : "Create Event"}
                    </button>
                    {message && <span style={{ color: message.startsWith("Error") ? "#b00020" : "#2e7d32" }}>{message}</span>}
                </div>
            </form>
        </div>
    );
}


