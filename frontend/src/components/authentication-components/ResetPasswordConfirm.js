import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import loginStyles from './styles/Login.module.css';

// This component is used to reset a user's password after they have requested a password reset email
// You will be able to navigate to it from the link in the email, which will contain a token in the URL params
// The token is used to verify the user's identity and reset their password

// Note: All password reset logic on the backend is associated with the userController.js and userRoutes.js files

// Right now I am just using the styling from the login form, but you can style this however you want

function ResetPasswordConfirm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { token } = useParams();

    // If there's a message (which we set on successful password reset), navigate back after 3 seconds
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Reset error state on new submission
        setError('');

        // fetch request to reset password, using token from URL params and new password from state
        try {
            const response = await fetch(`/api/users/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            // if something went wrong, throw an error
            if (!response.ok) {
                throw new Error(data.error || 'Failed to reset password.');
            }
            // if successful, set a message and navigate back to login page after 3 seconds
            setMessage('Password reset successfully. Redirecting to login page...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={loginStyles.loginContainer}>
            <form onSubmit={handleSubmit} className={loginStyles.loginForm}>
                <h2>reset password</h2>
                {error && <p className={loginStyles.errorMessage}>{error}</p>}
                {message && <p className={loginStyles.successMessage}>{message}</p>}
                <div className={loginStyles.inputContainer}>
                    <label className={loginStyles.labelStyle}>new password:</label>
                    <input
                        className={loginStyles.inputField}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className={loginStyles.inputContainer}>
                    <label className={loginStyles.labelStyle}>confirm new password:</label>
                    <input
                        className={loginStyles.inputField}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className={loginStyles.basicButton}>Submit</button>
            </form>
        </div>
    );
}

export default ResetPasswordConfirm;