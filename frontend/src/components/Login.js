import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
        <div>
            <div style={{position: 'absolute', top: 181, height: 60, left: 385, width: 670, color: 'black', fontSize: 40, fontFamily: 'Poppins', fontWeight: 400, wordWrap: 'break-word'}}>Palaver Strings Student Hub Login
        </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{position: 'absolute', top: 344, left: 507, width: 169, height: 36, fontSize: 20, fontWeight: 400}}>
                    <label>Email Address:</label>
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
                <div style={{ position: 'absolute', height: 65, width: 159, top: 568, right: 640}}> 
                    <div style={{width: '100%', height: '100%', padding: 10, background: '#C69C64', borderRadius: 15, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex'}}>
                        <div style={{justifyContent: 'center', alignItems: 'center', gap: 10, display: 'flex'}}>
                            <div style={{width: 242, height: 97, textAlign: 'center', color: 'white', fontSize: 40, fontFamily: 'Poppins', fontWeight: '300', wordWrap: 'break-word'}}>
                                <button type="submit" style={{width: '100%', height: '100%', background: 'transparent', border: 'none', color: 'inherit', fontSize: 'inherit', fontFamily: 'inherit'}}>Login</button>
                                <button style={{ position: 'absolute', top: 568, left: 641}}></button>
                            </div>
                        </div>
                    </div>
                </div>  
            </form>
        </div>
    );
}

export default AdminLogin;