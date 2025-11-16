/**
 * API Configuration
 * 
 * The API base URL is read from the environment variable VITE_API_BASE_URL.
 * If not set, it defaults to a fallback URL.
 * 
 * To configure, create a .env file in the root directory with:
 * VITE_API_BASE_URL=https://your-api-domain.com
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ycn3kxfuwivhlodsyjsfsywf3y0qmcyx.lambda-url.us-east-1.on.aws';

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn('VITE_API_BASE_URL is not set in environment variables. Using default fallback URL.');
}

