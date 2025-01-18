
import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom'; 
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const api = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}/api/auth`
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
        <>
            <p className='mainbtn googlebtn' type='button' onClick={googleLogin}>
                <i className="fa-brands fa-google tag-icon"></i> Continue with Google
            </p>
        </>
    );
}