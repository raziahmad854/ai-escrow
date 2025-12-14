// frontend/config/api.js or frontend/src/config/api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  'https://ai-escrow-backend.onrender.com';

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