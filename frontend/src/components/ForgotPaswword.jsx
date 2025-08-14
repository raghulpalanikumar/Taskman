import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { authAPI } from "../services/api.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setMessage("Password reset email sent! Please check your inbox and follow the link to reset your password.");
      setEmail("");
    } catch (err) {
      console.error('Forgot password error:', err.message);
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Forgot Your Password?" 
      subtitle="Enter your email address and we'll send you a link to reset your password"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input 
            id="email"
            type="email" 
            className="form-input"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? (
            <>
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                  <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                  <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                </circle>
              </svg>
              Sending Reset Link...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Send Reset Link
            </>
          )}
        </button>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        <div className="auth-links">
          <p>
            Remember your password?{" "}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign up here
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
