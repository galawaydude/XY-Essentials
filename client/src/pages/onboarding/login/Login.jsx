import React, { useEffect, useState } from 'react';
import './login.css'; // Import the CSS file
import OAuth from '../../../components/oauth/OAuth';
import { Link } from 'react-router-dom'; 
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
  
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }), // Use email and password from state
            });
  
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
  
            // Handle successful login
            // alert('Login successful!');
            localStorage.setItem('user-info', JSON.stringify(data)); // Save user info if needed
            navigate('/'); // Redirect to the home page or dashboard
  
        } catch (error) {
            setError(error.message);
        }
    };

    const [user, setUser] = useState(null);

    const api = axios.create({
        baseURL: 'http://localhost:5000/api/auth'
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user-info');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const responseGoogle = async (authResult) => {
        try {
            if (authResult && authResult.code) {
                const code = authResult.code;
                const response = await api.get(`/google?code=${code}`, {
                    withCredentials: true
                });

                const { email, name, pfp } = response.data.user;
                const token = response.data.token;
                const highQualityPfp = pfp.replace(/=s\d+-c/, '=s400');

                const obj = { email, name, pfp: highQualityPfp, token };
                localStorage.setItem('user-info', JSON.stringify(obj));
        
                setUser(obj);
                // console.log(response.data.user);
                navigate('/');
            }
        } catch (err) {
            console.error('Error while requesting Google token: ', err);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: 'auth-code'
    });

    return (
        <div className="login-maincon section container">
            <div className="login-con">
                <div className="login-head">
                    <h3>Login</h3>
                </div>
                <div className="login-form-con">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="input-component">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="example@email.com"
                                id="email"
                                value={email} // Link state to input
                                onChange={(e) => setEmail(e.target.value)} // Update state on change
                                required
                            />
                        </div>
                        <div className="input-component">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                id="password"
                                value={password} // Link state to input
                                onChange={(e) => setPassword(e.target.value)} // Update state on change
                                required
                            />
                        </div>

                        <button className="btn btn-primary" type="submit">
                            Login
                        </button>

                        <div className="using-google" onClick={googleLogin}>
                            <p>or</p>
                            <OAuth />
                        </div>

                        <p className="login-text">
                            Don't have an account? <span className='text-blue-700'>Sign up</span>
                        </p>
                    </form>
                    {error && <div className="error-message">{error}</div>} {/* Display error message */}
                </div>
            </div>
        </div>
    );
};

export default Login;
