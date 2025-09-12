import React, { useState } from "react";

export default function CreateEvent() {
    const [form, setForm] = useState({
        title: "",
        date: "",
        time: "",
        location: "",
        capacity: "",
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
        const capacityNum = Number(form.capacity);
        return (
            form.title.trim() &&
            form.date &&
            form.time &&
            form.location.trim() &&
            form.description.trim() &&
            Number.isFinite(capacityNum) && capacityNum > 0 &&
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
            formData.append("date", form.date);
            formData.append("time", form.time);
            formData.append("location", form.location.trim());
            formData.append("capacity", String(Number(form.capacity)));
            formData.append("description", form.description.trim());
            formData.append("image", imageFile);

            const res = await fetch("/api/org/events", {
                method: "POST",
                body: formData
            });
            if (!res.ok) throw new Error("Failed to create event");
            setMessage("Event created successfully.");
            setForm({ title: "", date: "", time: "", location: "", capacity: "", description: "" });
            setImageFile(null);
            setImagePreview("");
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
                    <label htmlFor="image"><strong>Cover Image</strong> *</label>
                    <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="form-control"
                        onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            setImageFile(file || null);
                            if (file) {
                                const url = URL.createObjectURL(file);
                                setImagePreview(url);
                            } else {
                                setImagePreview("");
                            }
                        }}
                        required
                    />
                    {imagePreview && (
                        <div style={{ marginTop: 8 }}>
                            <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", borderRadius: 8 }} />
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="title"><strong>Title</strong> *</label>
                    <input id="title" name="title" type="text" value={form.title} onChange={onChange} className="form-control" placeholder="e.g., Beach Cleanup" required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                        <label htmlFor="date"><strong>Date</strong> *</label>
                        <input id="date" name="date" type="date" value={form.date} onChange={onChange} className="form-control" required />
                    </div>
                    <div>
                        <label htmlFor="time"><strong>Time</strong> *</label>
                        <input id="time" name="time" type="time" value={form.time} onChange={onChange} className="form-control" required />
                    </div>
                </div>
                <div>
                    <label htmlFor="location"><strong>Location</strong> *</label>
                    <input id="location" name="location" type="text" value={form.location} onChange={onChange} className="form-control" placeholder="City, Address or Online" required />
                </div>
                <div>
                    <label htmlFor="capacity"><strong>Capacity (volunteers needed)</strong> *</label>
                    <input id="capacity" name="capacity" type="number" min="1" step="1" value={form.capacity} onChange={onChange} className="form-control" placeholder="e.g., 25" required />
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


