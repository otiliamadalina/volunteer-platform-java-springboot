import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLeftPanel from "./adminLeftPanel";
import "../../styles/admin.css"
import "../../styles/main.css"

export default function ManageFeedbacks() {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role && role.toUpperCase() !== "ADMIN") {
            navigate("/");
            return;
        }
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch("http://localhost:8080/api/admin/feedbacks", {
                method: "GET",
                credentials: "include"
            });
            if (!res.ok) throw new Error(`Failed to fetch feedbacks: ${res.status}`);
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("Failed to fetch feedbacks:", e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this feedback?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/admin/feedbacks/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (res.ok || res.status === 204) {
                setItems(prev => prev.filter(i => i.id !== id));
            } else {
                const text = await res.text();
                alert("Failed to delete: " + text);
            }
        } catch (e) {
            console.error("Delete feedback error:", e);
            alert("Failed to delete feedback.");
        }
    };

    const filtered = items.filter(f => {
        const q = search.toLowerCase();
        return (
            (f.subject || "").toLowerCase().includes(q) ||
            (f.senderEmail || "").toLowerCase().includes(q) ||
            (f.message || "").toLowerCase().includes(q)
        );
    });

    return (
        <div className="dashboard-wrapper">

            <div className="card notify-manage-card" style={{ flex: 1 }}>
                <h3>Manage Feedbacks</h3>

                <div className="search-container">
                    <input
                        className="form-control search-input"
                        placeholder="Search by subject, email, message..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading && <p>Loading feedbacks...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}

                {!loading && (
                    <div className="table-container">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Subject</th>
                                    <th>Sender Email</th>
                                    <th>Sent At</th>
                                    <th>Message</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(f => (
                                    <tr key={f.id}>
                                        <td>{f.id}</td>
                                        <td>{f.subject}</td>
                                        <td>{f.senderEmail}</td>
                                        <td>{f.sentAt ? new Date(f.sentAt).toLocaleString() : '-'}</td>
                                        <td style={{ maxWidth: 420, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.message}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(f.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && <p className="empty-state">No feedbacks found.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}