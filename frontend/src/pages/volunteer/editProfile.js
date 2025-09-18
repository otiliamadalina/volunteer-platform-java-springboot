import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/main.css";
import "../../styles/forms.css";

export default function EditProfile() {
    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = "http://localhost:8080/api/volunteer/profile";

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(API_URL, { withCredentials: true });
                setProfileData(prevState => ({
                    ...prevState,
                    fullName: response.data.fullName,
                    email: response.data.email
                }));
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setMessage("Failed to load profile data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleBasicInfoSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const dataToUpdate = {
                fullName: profileData.fullName,
                email: profileData.email,
                password: null
            };

            await axios.put(API_URL, dataToUpdate, { withCredentials: true });
            setMessage("Basic information updated successfully!");
        } catch (error) {
            console.error("Error updating basic info:", error);
            setMessage("Failed to update basic information.");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!profileData.newPassword || !profileData.confirmNewPassword) {
            setMessage("Password fields cannot be empty!");
            return;
        }

        if (profileData.newPassword !== profileData.confirmNewPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            const dataToUpdate = {
                fullName: profileData.fullName,
                email: profileData.email,
                password: profileData.newPassword
            };

            await axios.put(API_URL, dataToUpdate, { withCredentials: true });
            setMessage("Password changed successfully!");

            setProfileData(prevState => ({
                ...prevState,
                newPassword: "",
                confirmNewPassword: ""
            }));
        } catch (error) {
            console.error("Error changing password:", error);
            setMessage("Failed to change password.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    if (isLoading) {
        return <div className="loading-message">Loading profile...</div>;
    }

    return (
        <div className="edit-profile-card">
            <h3>Edit Profile</h3>
            <p>Update your profile information.</p>

            <div className="edit-profile-row-container">
                {/* Secțiunea 1: Informații de bază */}
                <div className="section-container">
                    <h4>Basic Information</h4>
                    <form onSubmit={handleBasicInfoSubmit} className="edit-profile-form">
                        <div className="edit-profile-form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={profileData.fullName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="edit-profile-form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="edit-profile-btn edit-profile-btn-primary">Save Info</button>
                    </form>
                </div>

                {/* Secțiunea 2: Schimbare parolă */}
                <div className="section-container">
                    <h4>Change Password</h4>
                    <form onSubmit={handlePasswordSubmit} className="edit-profile-form">
                        <div className="edit-profile-form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={profileData.newPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="edit-profile-form-group">
                            <label htmlFor="confirmNewPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmNewPassword"
                                name="confirmNewPassword"
                                value={profileData.confirmNewPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="edit-profile-btn edit-profile-btn-primary">Save Password</button>
                    </form>
                </div>
            </div>

            {message && (
                <div className={`edit-profile-message-box ${message.includes("success") ? "success" : "error"}`}>
                    {message}
                </div>
            )}
        </div>
    );
}