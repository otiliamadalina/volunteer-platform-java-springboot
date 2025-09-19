import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/organisation.css';
import '../../styles/main.css';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    return { isAuthenticated };
};

export default function Organisations() {
    const [organizations, setOrganizations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchOrganisations = async () => {
            if (!isAuthenticated) {
                console.error("User not authenticated, redirecting to login.");
                navigate('/login');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get("http://localhost:8080/api/orgs", {
                    withCredentials: true
                });
                setOrganizations(response.data);
                setError(null);
            } catch (err) {
                setError("Error fetching organisations. Please try again later.");
                console.error("Failed to fetch organisations", err);
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                    console.error("Authentication failed, redirecting to login.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrganisations();
    }, [isAuthenticated]);

    const filteredOrganizations = organizations.filter(org =>
        org.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="loading-message">Loading organizations...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="organizations-container">
            <div className="card-container">
                <h3 className="page-heading">Registered Organisations</h3>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by Name, Location or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="table-container">
                    <table className="organisations-table">
                        <thead>
                        <tr>
                            <th>ORG Name</th>
                            <th>Location</th>
                            <th>Email</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredOrganizations.length > 0 ? (
                            filteredOrganizations.map(org => (
                                <tr key={org.id}>
                                    <td>{org.fullName}</td>
                                    <td>{org.location}</td>
                                    <td>{org.email}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="empty-table-message">
                                    No available ORGs.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

