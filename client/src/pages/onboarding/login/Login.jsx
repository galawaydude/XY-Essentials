import React, {useEffect, useState} from 'react';
import './login.css'; // Import the CSS file
import OAuth from '../../../components/oauth/OAuth';
import { Link } from 'react-router-dom'; 
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

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
                console.log(response.data.user);
                // console.log(response.data.token);
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
                <h3>    Login</h3>
                </div>
                <div className="login-form-con">
                    <form className="login-form">
                        <div className="input-component ">
                            <label>Email</label>
                            <input type="email" placeholder="example@email.com" id='email' />
                        </div>
                        <div className="input-component ">
                            <label>Password</label>
                            <input type="password" placeholder="Enter your password" id='password' />
                        </div>

                

                        <button className="btn btn-primary">
                            Login
                        </button>

                        <div className="using-google" onClick={googleLogin}>
                            <p>or</p>
                            <OAuth />
                        </div>

                        {/* <div className="divider"></div> */}

                        <p className="login-text">Don't have an account? <span className='text-blue-700'>Sign up</span></p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
