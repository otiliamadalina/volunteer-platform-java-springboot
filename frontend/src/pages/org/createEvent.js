import React, { useState } from "react";
import "../../styles/events.css";

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
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

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
            new Date(form.startDate) < new Date(form.endDate) &&
            !!imageFile
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
            const formData = new FormData();
            formData.append("title", form.title.trim());
            formData.append("description", form.description.trim());
            formData.append("location", form.location.trim());
            formData.append("startDate", form.startDate);
            formData.append("endDate", form.endDate);
            formData.append("maxVolunteers", String(Number(form.maxVolunteers)));
            formData.append("image", imageFile);

            const res = await fetch("http://localhost:8080/api/org/events", {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-Org-Email": localStorage.getItem("email") || ""
                },
                body: formData
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to create event: ${res.status} - ${errorText}`);
            }
            setMessage("Event created successfully.");
            setForm({ title: "", startDate: "", endDate: "", location: "", maxVolunteers: "", description: "" });
            setImageFile(null);
            setImagePreview("");
        } catch (err) {
            setMessage("Error: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card">
            <h3>Create Event</h3>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="image"><strong>Event Image</strong> *</label>
                    <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="form-control"
                        onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            setImageFile(file || null);
                            if (file) setImagePreview(URL.createObjectURL(file));
                            else setImagePreview("");
                        }}
                        required
                    />
                    {imagePreview && <img src={imagePreview} alt="Preview" className="preview" />}
                </div>
                <div>
                    <label htmlFor="title"><strong>Title</strong> *</label>
                    <input id="title" name="title" type="text" value={form.title} onChange={onChange} className="form-control" placeholder="e.g., Beach Cleanup" required />
                </div>
                <div className="grid-two-columns">
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
                    {message && <span className="message" style={{ color: message.startsWith("Error") ? "#b00020" : "#2e7d32" }}>{message}</span>}
                </div>
            </form>
        </div>
    );
}
