import React, { useState, useEffect } from "react";
import "../../styles/admin.css";
import "../../styles/main.css";

export default function ManageVolunteers() {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        try {
            console.log("Fetching volunteers from /api/admin/volunteers");
            const res = await fetch("http://localhost:8080/api/admin/volunteers", {
                method: "GET",
                credentials: "include"
            });

            console.log("Response status:", res.status);

            if (res.ok) {
                const data = await res.json();
                console.log("Received volunteers data:", data);
                console.log("Number of volunteers:", data.length); // Add this
                setVolunteers(data);
            } else {
                const errorText = await res.text();
                console.error("Failed to fetch volunteers:", res.status, errorText);
            }
        } catch (err) {
            console.error("Failed to fetch volunteers:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredVolunteers = volunteers.filter(volunteer => {
        const matchesSearch = 
            volunteer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            volunteer.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearch;
    });

    const handleView = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setShowViewModal(true);
    };

    const handleDelete = async (volunteerId) => {
        if (window.confirm("Are you sure you want to delete this volunteer?")) {
            try {
                const res = await fetch(`http://localhost:8080/api/admin/volunteers/${volunteerId}`, {
                    method: "DELETE",
                    credentials: "include"
                });

                if (res.ok) {
                    // Remove the volunteer from the list
                    setVolunteers(volunteers.filter(v => v.id !== volunteerId));
                    alert("Volunteer deleted successfully!");
                } else {
                    alert("Failed to delete volunteer. Please try again.");
                }
            } catch (err) {
                console.error("Failed to delete volunteer:", err);
                alert("Failed to delete volunteer. Please try again.");
            }
        }
    };

    const handleCloseModal = () => {
        setShowViewModal(false);
        setSelectedVolunteer(null);
    };


    if (loading) {
        return (
            <div className="card manage-card">
                <h3>Manage Volunteers</h3>
                <p>Loading volunteers...</p>
            </div>
        );
    }

    return (
        <div className="card manage-card">
            <h3>Manage Volunteers</h3>
            
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search volunteers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control search-input"
                />
            </div>

            <div className="table-container">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVolunteers.map(volunteer => (
                            <tr key={volunteer.id}>
                                <td>{volunteer.id}</td>
                                <td>{volunteer.fullName}</td>
                                <td>{volunteer.email}</td>
                                <td>
                                    <button 
                                        className="btn btn-sm btn-outline-primary me-2" 
                                        onClick={() => handleView(volunteer)}
                                    >
                                        View
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-outline-danger" 
                                        onClick={() => handleDelete(volunteer.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredVolunteers.length === 0 && (
                <p className="empty-state">
                    No volunteers found matching your criteria.
                </p>
            )}

            {/* View Modal */}
            {showViewModal && selectedVolunteer && (
                <div className="modal modal-overlay">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Volunteer Details</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <strong>ID:</strong> {selectedVolunteer.id}
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Full Name:</strong> {selectedVolunteer.fullName}
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <strong>Email:</strong> {selectedVolunteer.email}
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Account Created:</strong> {selectedVolunteer.createdAt ? new Date(selectedVolunteer.createdAt).toLocaleDateString() : "N/A"}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}