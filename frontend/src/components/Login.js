import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginButton from './Button';
import styles from './Login.module.css';

function AdminLogin() {
    // State variables for form inputs and error messages
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    
    // Hook to programmatically navigate to a new page
    const navigate = useNavigate();

    // Get the login function from the AuthContext (see the contexts folder)
    const { login } = useAuth();  

    // Handler for the login form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Send the email and password to the database for verification
        try {
            console.log('Sending login request...');
            const response = await fetch('/api/admins/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
        
            console.log('Response received:', response);
            const data = await response.json();
            console.log('Data:', data);
            
            // Check if the respons status was bad
            if (response.status !== 200) {
                setError(data.message);
                return;
            }
            // If it was successful, take the following action
            if (response.status === 200) {
                localStorage.setItem('adminToken', data.token); // Store the received token locally.
                login(true); // update the global authentication state
                navigate('/'); // Go to the homepage after successful login
            }
        } catch (err) {
            console.error('Error during login:', err);
            setError('Something made an oopsie!');
        }
    };

    return (
        <div className={styles.header}>
            <h1> Palaver Strings Student Hub </h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <LoginButton onClick={handleSubmit}/>
            </form>
        </div>
    );
}

export default AdminLogin;