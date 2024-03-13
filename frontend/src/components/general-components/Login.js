import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginButton from './LoginButton';
import PasswordResetRequestButton from './PasswordResetRequestButton';
import loginStyles from './styles/Login.module.css';
import Loader from './Loader';

function Login() {

    // Hook for managing loading state
    const [loading, setLoading] = useState(false);

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
        setLoading(true); // Sets loading state to true
        
        try {            
            // Dynamically uses the correct login endpoint based on the selected user type
            let loginUrl = `/api/${userType}s/login`;

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
                localStorage.setItem('email', email); 
                login({ type: userType, id: data.id }); // Updates the AuthContext
                navigate('/'); // Navigates user to the home page
            }
        } catch (err) {
            console.error('Error during login:', err);
            setError('Something made an oopsie!');
        } finally {
            setLoading(false); // Sets loading state to false
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className={loginStyles.loginContainer}>

        <div className={`${loginStyles.loginForm} ${loginStyles.formHeader}`}>Palaver Strings Student Hub</div>
        {error && <p className={loginStyles.errorMessage}>{error}</p>}
            <form onSubmit={handleSubmit} className={loginStyles.loginForm}>
                
                <div className={loginStyles.inputContainer}>
                    <label className={loginStyles.labelStyle}>User Type:</label>
                    <select className={loginStyles.dropdownBox} value={userType} onChange={(e) => setUserType(e.target.value)}>
                        <option value="admin">Admin</option>
                        <option value="instructor">Instructor</option>
                        <option value="parent">Parent</option>
                        <option value="student">Student</option>
                    </select>
                </div>
                
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
                
                <div className={loginStyles.inputContainer}>
                    <label className={loginStyles.labelStyle}>Password:</label>
                    <input
                        className={loginStyles.inputField}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <div className={loginStyles.buttonSpacing}>
                    <LoginButton onClick={handleSubmit}/>
                </div>

                <div className={loginStyles.buttonSpacing}>
                    <PasswordResetRequestButton onClick={() => navigate('/password-reset-request')}></PasswordResetRequestButton>
                </div>
                
            </form>
        </div>
    );
}

export default Login;