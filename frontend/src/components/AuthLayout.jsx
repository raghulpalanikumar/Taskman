import React from 'react';
import { Link } from 'react-router-dom';
import './AuthLayout.css';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-layout">
      {/* Header */}
      <header className="auth-header">
        <div className="header-container">
          <div className="logo-section">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11H7C5.9 11 5 10.1 5 9V7C5 5.9 5.9 5 7 5H9C10.1 5 11 5.9 11 7V9C11 10.1 10.1 11 9 11Z" fill="white"/>
                <path d="M9 19H7C5.9 19 5 18.1 5 17V15C5 13.9 5.9 13 7 13H9C10.1 13 11 13.9 11 15V17C11 18.1 10.1 19 9 19Z" fill="white"/>
                <path d="M17 11H15C13.9 11 13 10.1 13 9V7C13 5.9 13.9 5 15 5H17C18.1 5 19 5.9 19 7V9C19 10.1 18.1 11 17 11Z" fill="white"/>
                <path d="M17 19H15C13.9 19 13 18.1 13 17V15C13 13.9 13.9 13 15 13H17C18.1 13 19 13.9 19 15V17C19 18.1 18.1 19 17 19Z" fill="white"/>
              </svg>
            </div>
            <Link to="/" className="logo-text">TaskMan</Link>
          </div>
          
          <nav className="header-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/features" className="nav-link">Features</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="auth-main">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header-content">
              <h1 className="auth-title">{title}</h1>
              <p className="auth-subtitle">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <div className="logo-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11H7C5.9 11 5 10.1 5 9V7C5 5.9 5.9 5 7 5H9C10.1 5 11 5.9 11 7V9C11 10.1 10.1 11 9 11Z" fill="currentColor"/>
                    <path d="M9 19H7C5.9 19 5 18.1 5 17V15C5 13.9 5.9 13 7 13H9C10.1 13 11 13.9 11 15V17C11 18.1 10.1 19 9 19Z" fill="currentColor"/>
                    <path d="M17 11H15C13.9 11 13 10.1 13 9V7C13 5.9 13.9 5 15 5H17C18.1 5 19 5.9 19 7V9C19 10.1 18.1 11 17 11Z" fill="currentColor"/>
                    <path d="M17 19H15C13.9 19 13 18.1 13 17V15C13 13.9 13.9 13 15 13H17C18.1 13 19 13.9 19 15V17C19 18.1 18.1 19 17 19Z" fill="currentColor"/>
                  </svg>
                </div>
                TaskMan
              </div>
              <p className="footer-description">
                The ultimate task management solution for individuals and teams.
              </p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4 className="footer-column-title">Product</h4>
                <Link to="/features" className="footer-link">Features</Link>
                <Link to="/pricing" className="footer-link">Pricing</Link>
                <Link to="/integrations" className="footer-link">Integrations</Link>
              </div>
              
              <div className="footer-column">
                <h4 className="footer-column-title">Company</h4>
                <Link to="/about" className="footer-link">About</Link>
                <Link to="/blog" className="footer-link">Blog</Link>
                <Link to="/contact" className="footer-link">Contact</Link>
              </div>
              
              <div className="footer-column">
                <h4 className="footer-column-title">Support</h4>
                <Link to="/help" className="footer-link">Help Center</Link>
                <Link to="/docs" className="footer-link">Documentation</Link>
                <Link to="/community" className="footer-link">Community</Link>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="footer-bottom-text">
              © 2024 TaskMan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout; 