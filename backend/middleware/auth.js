import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  console.log('Auth middleware - Token:', token ? 'Present' : 'Missing');

  // Check if no token
  if (!token) {
    console.log('Auth middleware - No token provided');
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    // Verify token
    console.log('Auth middleware - Attempting to verify token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Token verified, user:', decoded.id);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth middleware - Token verification failed:', err.message);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

export default auth;