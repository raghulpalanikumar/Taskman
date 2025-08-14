// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const config = {
  API_BASE_URL,
  API_ENDPOINTS: {
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  }
};

export default config; 