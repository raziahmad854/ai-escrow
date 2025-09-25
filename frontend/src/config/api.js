// src/config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production'
    ? 'https://ai-escrow-backend-production.up.railway.app'
    : 'http://localhost:5000'
  );

export default API_BASE_URL;

// Optional: Export a configured fetch function
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const config = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};