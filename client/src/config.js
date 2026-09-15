// Base URL for the backend API (no trailing slash).
// Configure via client/.env — see client/.env.example
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

export default API_URL;
