import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import auth from '../middleware/auth.js'; // Import the auth middleware

dotenv.config();
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  console.log('Signup request received:', req.body);
  const { name, email, password } = req.body;
  
  // Validate input
  if (!name || !email || !password) {
    console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Generate username from email (take part before @)
    const username = email.split('@')[0];
    
    // Create user - password will be hashed by the pre-save hook
    const user = new User({ name, email, password, username });
    console.log('Attempting to save user:', { name, email, username });
    await user.save();
    
    console.log('User created successfully:', user._id);
    res.status(201).json({ message: 'User created successfully', userId: user._id });
  } catch (err) {
    console.error('Signup error:', err.message);
    console.error('Signup error stack:', err.stack);
    
    // Handle specific MongoDB errors
    if (err.code === 11000) {
      if (err.keyPattern.email) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }
      if (err.keyPattern.username) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      return res.status(400).json({ error: 'User already exists' });
    }
    
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// Login

router.post('/login', async (req, res) => {
  console.log('Login request received:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Missing login fields:', { email: !!email, password: !!password });
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('User found:', {
      email: user.email,
      passwordHash: user.password,
      inputPassword: password
    });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log('Login successful for user:', user.name);
    res.json({ token, name: user.name });
  } catch (err) {
    console.error('Login error:', err.message);
    console.error('Login error stack:', err.stack);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Use configurable frontend URL for reset link
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${frontendUrl}/reset-password/${token}`;
  const mailOptions = {
    to: email,
    subject: 'Reset Password',
    html: `<p>Click to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) return res.status(500).json({ error: 'Error sending email' });
    res.json({ message: 'Reset link sent' });
  });
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  console.log('Reset password request received');
  const { token, password } = req.body;
  
  if (!token || !password) {
    return res.status(400).json({ error: 'Token and password are required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified for user ID:', decoded.id);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found for ID:', decoded.id);
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Set the password directly - the pre-save hook will hash it
    user.password = password;
    await user.save();
    
    console.log('Password reset successful for user:', user.email);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err.message);
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    res.status(500).json({ error: 'Server error during password reset' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password field
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
