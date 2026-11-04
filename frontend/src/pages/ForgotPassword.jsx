import React, { useState } from 'react';
import axios from '../lib/axios';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [securityCode, setSecurityCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const res = await axios.post("/user/forgot-password", {
                email,
                securityCode,
                newPassword
            });

            if (res.data.success) {
                setMessage(res.data.message);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <main className="auth-page"><section className="auth-card">
          <div className="auth-brand"><div className="auth-mark"><span /><span /><span /></div><span>ChatUI</span></div>
          <header className="auth-heading"><p>Account recovery</p><h1>Set a new password</h1></header>
                <form onSubmit={handleSubmit} className="auth-form">
                    <label>Email address
                    <input
                        type='email'
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    /></label>
                    <label>Security code
                    <input
                        type='text'
                        placeholder='Enter 4-digit security code'
                        value={securityCode}
                        onChange={(e) => setSecurityCode(e.target.value)}
                        required
                    /></label>
                    <label>New password
                    <input
                        type='password'
                        placeholder='Enter new password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                    /></label>
                    
                    {error && <p className='form-error form-error--center'>{error}</p>}
                    {message && <p className='form-success'>{message}</p>}

                    <button
                        type='submit'
                        className='auth-submit'
                    >
                        Reset Password
                    </button>
                </form>
                <div className='auth-link-row auth-link-row--center'>
                    <Link to="/login">Back to sign in</Link>
                </div>
        </section></main>
    );
};

export default ForgotPassword;
