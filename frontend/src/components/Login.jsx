import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { authAPI } from "../services/api.js";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!data.email || !data.password) {
      setError("All fields are required");
      return;
    }
    
    setLoading(true);
    try {
      console.log('Login attempt for:', data.email);
      const response = await authAPI.login(data);
      console.log('Login successful:', response);
      
      localStorage.setItem("token", response.token);
      localStorage.setItem("name", response.name);
      navigate("/dashboard");
    } catch (err) {
      console.error('Login error:', err.message);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your account to continue managing your tasks"
    >
      <form onSubmit={handleSubmit} className="auth-form">
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
            placeholder="Enter your password"
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
              Signing In...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sign In
            </>
          )}
        </button>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="auth-links">
          <p>
            <Link to="/forgot-password" className="auth-link">
              Forgot your password?
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
