import React, { useState, useRef } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa'; // Add this import
import OAuth from '../../../components/oauth/OAuth';
import { useNavigate } from 'react-router-dom';
import './otp.css';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [otp, setOtp] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');
    const otpInputs = useRef([]);

    const checkPasswordStrength = (password) => {
        const strongRegex = new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
        );
        const mediumRegex = new RegExp(
            '^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,})'
        );

        if (strongRegex.test(password)) return 'strong';
        if (mediumRegex.test(password)) return 'medium';
        return 'weak';
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/[a-z]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one lowercase letter';
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one number';
        } else if (!/[!@#$%^&*]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one special character';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            setOtpSent(true);
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: error.message
            })); 
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp.trim()) {
            setErrors(prev => ({...prev, otp: 'OTP is required'}));
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: formData.email,
                    otp
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            navigate('/account');
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                otp: error.message
            }));
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        
        const newOtp = otp.split('');
        newOtp[index] = value;
        setOtp(newOtp.join(''));

        // Auto-focus next input
        if (value && index < 5) {
            otpInputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputs.current[index - 1].focus();
        }
    };

    return (
        <div className="login-maincon section container">
            <div className="login-con">
                <div className="login-head">
                    <h3>Sign up</h3>
                </div>
                <div className="login-form-con">
                    {!otpSent ? (
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="input-component">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    disabled={loading}
                                />
                                {errors.name && <span className="error-text">{errors.name}</span>}
                            </div>

                            <div className="input-component">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
                                    disabled={loading}
                                />
                                {errors.email && <span className="error-text">{errors.email}</span>}
                            </div>

                            <div className="input-component">
                                <label>Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setPasswordStrength(checkPasswordStrength(e.target.value));
                                        }}
                                        placeholder="Enter your password"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex="-1"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {passwordStrength && (
                                    <div className={`password-strength ${passwordStrength}`}>
                                        Password strength: {passwordStrength}
                                    </div>
                                )}
                                {errors.password && <span className="error-text">{errors.password}</span>}
                            </div>

                            <div className="input-component">
                                <label>Confirm Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        tabIndex="-1"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                            </div>

                            {errors.submit && <div className="error-text">{errors.submit}</div>}

                            <button className="btn btn-primary" type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        Sending OTP <i className="fa fa-spinner fa-spin"></i>
                                    </>
                                ) : (
                                    'Sign up'
                                )}
                            </button>
                        </form>
                    ) : (
                        <form className="otp-form" onSubmit={handleVerifyOtp}>
                            <div className="otp-input-group">
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <input
                                        key={index}
                                        ref={el => otpInputs.current[index] = el}
                                        type="number"
                                        className="otp-digit"
                                        value={otp[index] || ''}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        maxLength={1}
                                        disabled={loading}
                                    />
                                ))}
                            </div>
                            {errors.otp && <span className="error-text">{errors.otp}</span>}
                            <button className="btn btn-primary" type="submit" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </form>
                    )}

                    {!otpSent && (
                        <>
                            <div className="using-google">
                                <p>or</p>
                                <OAuth />
                            </div>
                            <p className="login-text">
                                Already have an account? <a href="/login">Login</a>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Signup;
