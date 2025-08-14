# Deployment Guide for TaskMan

This guide explains how to configure TaskMan for production deployment to resolve the "forgot password" functionality issue.

## Problem Solved

The original issue was that the "forgot password" functionality worked locally but failed when deployed because:
1. Frontend API calls were hardcoded to `localhost:5000`
2. Backend reset links were hardcoded to `localhost:5173`

## Backend Configuration

### Environment Variables

Update your `backend/config.env` file:

```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=https://your-frontend-domain.com
```

**Important:** Set `FRONTEND_URL` to your actual frontend domain in production.

## Frontend Configuration

### Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# For development
VITE_API_URL=http://localhost:5000

# For production (replace with your actual backend URL)
VITE_API_URL=https://your-backend-domain.com
```

### Configuration File

The frontend now uses `frontend/src/config.js` which automatically reads the `VITE_API_URL` environment variable.

## Deployment Steps

### 1. Backend Deployment

1. Set up your backend server (e.g., Heroku, Railway, DigitalOcean)
2. Configure environment variables in your hosting platform
3. Set `FRONTEND_URL` to your frontend domain
4. Deploy your backend code

### 2. Frontend Deployment

1. Set up your frontend hosting (e.g., Vercel, Netlify, GitHub Pages)
2. Configure environment variables:
   - Set `VITE_API_URL` to your backend domain
3. Deploy your frontend code

### 3. Email Configuration

Ensure your email service is properly configured:
- Update `EMAIL_USER` and `EMAIL_PASS` in backend environment
- Use app passwords for Gmail (not regular passwords)
- Consider using services like SendGrid for production

## Example Configuration

### Development
```env
# Backend config.env
FRONTEND_URL=http://localhost:5173

# Frontend .env
VITE_API_URL=http://localhost:5000
```

### Production
```env
# Backend config.env
FRONTEND_URL=https://taskman-app.vercel.app

# Frontend .env
VITE_API_URL=https://taskman-backend.railway.app
```

## Testing

After deployment:
1. Test the signup functionality
2. Test the login functionality  
3. Test the forgot password flow:
   - Request password reset
   - Check email for reset link
   - Click the link and reset password
   - Verify you can login with new password

## Security Notes

- Change `JWT_SECRET` to a strong, unique value in production
- Use HTTPS in production
- Configure CORS properly if frontend and backend are on different domains
- Use environment variables for all sensitive configuration

## Troubleshooting

If the forgot password still doesn't work:
1. Check that `FRONTEND_URL` is correctly set in backend
2. Verify `VITE_API_URL` is correctly set in frontend
3. Ensure email service is working
4. Check browser console for any CORS errors
5. Verify the reset link in the email points to your production domain 