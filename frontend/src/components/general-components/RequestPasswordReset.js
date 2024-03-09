import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loginStyles from './styles/Login.module.css';

function RequestPasswordReset() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // If there's a message (which we set on successful email submission), navigate back after 3 seconds
        if (message) {
            const timer = setTimeout(() => {
                navigate('/login');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, navigate]);

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error state on new submission
        try {
            
            // fetch request to reset password, using token from URL params and new password from state
            const response = await fetch('/api/users/request-password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            
            // if something went wrong, throw an error
            if (response.ok) {
                setMessage('Check your email for the password reset link.');
            } else {
                throw new Error(data.message || 'Failed to send password reset email');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={loginStyles.loginContainer}>
            <form onSubmit={handleSubmit} className={loginStyles.loginForm}>
                <h2>Password Reset</h2>
                {error && <p className={loginStyles.errorMessage}>{error}</p>}
                {message && <p className={loginStyles.successMessage}>{message}</p>}
                <div className={loginStyles.inputContainer}>
                    <label className={loginStyles.labelStyle}>Email:</label>
                    <input
                        className={loginStyles.inputField}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className={loginStyles.basicButton}>Submit</button>
            </form>
        </div>
    );
}

export default RequestPasswordReset;