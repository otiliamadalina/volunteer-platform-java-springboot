import React, { useState, useMemo } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../../styles/contact.css';

export function Contact() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get the user's role from localStorage to check if they are authenticated
    const role = useMemo(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("role");
        }
        return null;
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('');

        if (!role) {
            // If the user is a guest, redirect to login
            setStatus('You must be logged in to send a message. Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        // Handle authenticated user submission
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post('http://localhost:8080/api/feedback', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            setStatus('Message sent successfully!');
            setFormData({ subject: '', message: '' });
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getDashboardLink = () => {
        switch (role) {
            case "VOLUNTEER":
                return "/volunteerDashboard";
            case "ORGANISATION":
                return "/organisationDashboard";
            case "ADMIN":
                return "/adminDashboard";
            default:
                return "/login";
        }
    };

    const getRegisterLink = () => {
        if (role) {
            return getDashboardLink();
        }
        return "/volunteerOrOrg";
    };

    return (
        <div className="contact-container">
            <h1 className="contact-title">Contact Us</h1>
            <p className="contact-subtitle">
                We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.
            </p>

            <div className="contact-info">
                <h3>Our Details:</h3>
                <p>
                    <strong>Email:</strong> <a href="mailto:volunteering@gmail.com">volunteering@gmail.com</a>
                </p>
                <p>
                    <strong>Phone:</strong> <a href="tel:+123456789">+123456789</a>
                </p>
                <p>
                    <strong>Address:</strong> Str. Chisinau, Nr. 10, Chisinau, 01234
                </p>
            </div>


            <div className="login-message-container">
                <p className="login-message-text">Please
                    <Link to={getDashboardLink()}> Login</Link> or
                    <Link to={getRegisterLink()}> Register</Link> to send us feedback.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting || !role}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        disabled={isSubmitting || !role}
                    ></textarea>
                </div>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
            </form>
            {status && <div className={`status-message ${status.includes('successfully') ? 'success' : 'error'}`}>{status}</div>}
        </div>
    );
}