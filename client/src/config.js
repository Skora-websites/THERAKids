// Base URL for the backend API (no trailing slash).
// Configure via client/.env — see client/.env.example
// IMPORTANT: VITE_API_URL is baked in at build time (npm run build).
// In production it MUST be set explicitly (e.g. https://api.therakids.skorainfotech.com).
// There is intentionally no localhost fallback: a build without it would make
// every visitor's browser call their own machine instead of the real API.
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

if (!API_URL && import.meta.env.PROD) {
  // eslint-disable-next-line no-console
  console.warn(
    '[config] VITE_API_URL is not set — API calls will be same-origin. ' +
    'Build with VITE_API_URL=https://api.therakids.skorainfotech.com or serve the API on the same domain.'
  );
}

export default API_URL;
