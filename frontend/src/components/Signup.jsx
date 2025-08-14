import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { authAPI } from "../services/api.js";

export default function Signup() {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!data.name || !data.email || !data.password) {
      setError("All fields are required");
      return;
    }
    
    setLoading(true);
    try {
      console.log('Signup attempt for:', data.email);
      await authAPI.signup(data);
      console.log('Signup successful');
      setSuccess("Account created successfully! Redirecting to login...");
      
      // Clear form data
      setData({ name: "", email: "", password: "" });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      console.error('Signup error:', err.message);
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Your Account" 
      subtitle="Join thousands of users who have already transformed their productivity with TaskMan"
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            id="name"
            type="text"
            className="form-input"
            placeholder="Enter your full name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            id="email"
            type="email"
            className="form-input"
            placeholder="Enter your email address"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            type="password"
            className="form-input"
            placeholder="Create a strong password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
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
              Creating Account...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Create Account
            </>
          )}
        </button>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="auth-links">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
