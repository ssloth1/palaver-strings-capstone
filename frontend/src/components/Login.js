import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginButton from './Button';
import styles from './Login.module.css';

function Login() {

    // Hooks for managing inputs 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('admin');
    const [error, setError] = useState(null);

    // Hook for handling navigation
    const navigate = useNavigate();

    // Custom hook to handle authentication/login
    const { login } = useAuth();  


    const handleSubmit = async (e) => {
        e.preventDefault(); 

        // Dynamically uses the correct login endpoint based on the selected user type
        let loginUrl = `/api/${userType}s/login`;


        try {
            // Makes a POST request to the login URL with the user's email and password
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            
            if (response.status !== 200) {
                setError(data.message);
                return;
            }

            // Successful login
            if (response.status === 200) {
                localStorage.setItem(`${userType}Token`, data.token); 
                login({ type: userType }); // Updates the AuthContext
                navigate('/'); // Navigates user to the home page
            }
        } catch (err) {
            console.error('Error during login:', err);
            setError('Something made an oopsie!');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginForm}>Palaver Strings Student Hub</div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <div>
                    <label className={styles.labelStyle}>User Type:</label>
                    <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                        <option value="admin">Admin</option>
                        <option value="instructor">Instructor</option>
                        <option value="parent">Parent</option>
                        <option value="student">Student</option>
                    </select>
                </div>
                <div>
                <label className={styles.labelStyle}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className={styles.labelStyle}>Password:</label>
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

export default Login;