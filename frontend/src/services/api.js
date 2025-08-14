const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  console.log('Retrieved token:', token ? `Token exists (${token.substring(0, 20)}...)` : 'No token found');
  return token;
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No token, authorization denied');
  }
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Helper function to make non-authenticated requests
const makeRequest = async (url, options = {}) => {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Task API methods
export const taskAPI = {
  // Get user profile
  getUserProfile: async () => {
    return makeAuthenticatedRequest('/auth/profile');
  },

  // Get all tasks
  getTasks: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.status && filters.status !== 'all') queryParams.append('completed', filters.status === 'completed');
    if (filters.priority && filters.priority !== 'all') queryParams.append('priority', filters.priority);
    if (filters.category && filters.category !== 'all') queryParams.append('category', filters.category);
    if (filters.tags) queryParams.append('tags', filters.tags);
    
    const url = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return makeAuthenticatedRequest(url);
  },

  // Create a new task
  createTask: async (taskData) => {
    return makeAuthenticatedRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  // Update a task
  updateTask: async (taskId, taskData) => {
    return makeAuthenticatedRequest(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  // Delete a task
  deleteTask: async (taskId) => {
    return makeAuthenticatedRequest(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },
};

// Auth API methods
export const authAPI = {
  // Login
  login: async (credentials) => {
    return makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Signup
  signup: async (userData) => {
    return makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Forgot password
  forgotPassword: async (email) => {
    return makeRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    return makeRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};
