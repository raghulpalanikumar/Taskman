import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { authAPI } from '../services/api.js';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    try {
      await authAPI.resetPassword(token, password);
      setMessage('Password reset successful! Please login with your new password.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Reset Your Password" 
      subtitle="Enter your new password to regain access to your account"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password" className="form-label">New Password</label>
          <input
            id="password"
            className="form-input"
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
          <input
            id="confirmPassword"
            className="form-input"
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? (
            <>
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                  <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                  <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                </circle>
              </svg>
              Resetting Password...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Reset Password
            </>
          )}
        </button>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        <div className="auth-links">
          <p>
            Remember your password?{" "}
            <a href="/login" className="auth-link">
              Sign in here
            </a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;