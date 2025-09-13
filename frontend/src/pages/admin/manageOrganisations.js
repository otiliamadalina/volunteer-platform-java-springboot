import React, { useState, useEffect } from "react";
import "../../styles/admin.css";
import "../../styles/main.css";

export default function ManageOrganisations() {
    const [organisations, setOrganisations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrganisation, setSelectedOrganisation] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    useEffect(() => {
        fetchOrganisations();
    }, []);

    const fetchOrganisations = async () => {
        try {
            console.log("Fetching organisations from /api/admin/organisations");
            const res = await fetch("http://localhost:8080/api/admin/organisations", {
                method: "GET",
                credentials: "include"
            });

            console.log("Response status:", res.status);

            if (res.ok) {
                const data = await res.json();
                console.log("Received organisations data:", data);
                console.log("Number of organisations:", data.length);
                setOrganisations(data);
            } else {
                const errorText = await res.text();
                console.error("Failed to fetch organisations:", res.status, errorText);
            }
        } catch (err) {
            console.error("Failed to fetch organisations:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrganisations = organisations.filter(organisation => {
        const matchesSearch = 
            organisation.organisationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            organisation.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearch;
    });

    const handleView = (organisation) => {
        setSelectedOrganisation(organisation);
        setShowViewModal(true);
    };

    const handleDelete = async (organisationId) => {
        if (window.confirm("Are you sure you want to delete this organisation?")) {
            try {
                const res = await fetch(`http://localhost:8080/api/admin/organisations/${organisationId}`, {
                    method: "DELETE",
                    credentials: "include"
                });

                if (res.ok) {
                    // Remove the organisation from the list
                    setOrganisations(organisations.filter(o => o.id !== organisationId));
                    alert("Organisation deleted successfully!");
                } else {
                    alert("Failed to delete organisation. Please try again.");
                }
            } catch (err) {
                console.error("Failed to delete organisation:", err);
                alert("Failed to delete organisation. Please try again.");
            }
        }
    };

    const handleCloseModal = () => {
        setShowViewModal(false);
        setSelectedOrganisation(null);
    };

    if (loading) {
        return (
            <div className="card" style={{ marginTop: 20 }}>
                <h3>Manage Organisations</h3>
                <p>Loading organisations...</p>
            </div>
        );
    }

    return (
        <div className="card" style={{ marginTop: 20 }}>
            <h3>Manage Organisations</h3>
            
            <div style={{ marginBottom: 20 }}>
                <input
                    type="text"
                    placeholder="Search organisations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control"
                    style={{ maxWidth: 300 }}
                />
            </div>

            <div style={{ overflowX: "auto" }}>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Organisation Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrganisations.map(organisation => (
                            <tr key={organisation.id}>
                                <td>{organisation.id}</td>
                                <td>{organisation.organisationName}</td>
                                <td>{organisation.email}</td>
                                <td>
                                    <button 
                                        className="btn btn-sm btn-outline-primary me-2" 
                                        onClick={() => handleView(organisation)}
                                    >
                                        View
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-outline-danger" 
                                        onClick={() => handleDelete(organisation.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredOrganisations.length === 0 && (
                <p style={{ textAlign: "center", marginTop: 20, color: "#6b6660" }}>
                    No organisations found matching your criteria.
                </p>
            )}

            {/* View Modal */}
            {showViewModal && selectedOrganisation && (
                <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Organisation Details</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <strong>ID:</strong> {selectedOrganisation.id}
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Organisation Name:</strong> {selectedOrganisation.organisationName}
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <strong>Email:</strong> {selectedOrganisation.email}
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Account Created:</strong> {selectedOrganisation.createdAt ? new Date(selectedOrganisation.createdAt).toLocaleDateString() : "N/A"}
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