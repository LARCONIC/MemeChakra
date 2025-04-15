/**
 * Helper functions to handle API requests when deployed on Netlify
 */

/**
 * Check if the app is running in development or production mode
 * @returns boolean
 */
export const isDevelopment = () => {
  return import.meta.env.DEV === true;
};

/**
 * Get the base API URL based on the environment
 * @returns string with the base API URL
 */
export const getBaseApiUrl = () => {
  return isDevelopment() 
    ? '/api' 
    : '/.netlify/functions/api';
};

/**
 * Make an API request with the correct base URL for the environment
 * @param endpoint The API endpoint to request (without the base URL)
 * @param options Fetch options
 * @returns Promise with the response
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const baseUrl = getBaseApiUrl();
  const url = `${baseUrl}/${endpoint.replace(/^\//, '')}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(error.message || 'Failed to fetch data');
  }
  
  return response.json();
};

/**
 * Post data to the API
 * @param endpoint The API endpoint to post to
 * @param data The data to post
 * @returns Promise with the response
 */
export const postData = async (endpoint: string, data: any) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Get data from the API
 * @param endpoint The API endpoint to get data from
 * @returns Promise with the response
 */
export const getData = async (endpoint: string) => {
  return apiRequest(endpoint);
};