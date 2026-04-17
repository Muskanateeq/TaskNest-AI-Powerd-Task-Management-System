/**
 * API Client Wrapper with Better Auth Integration
 *
 * Provides a centralized API client for making requests to the FastAPI backend.
 * Handles Better Auth JWT authentication, error handling, and request/response formatting.
 */

import { getAuthHeader } from './auth-client';

/**
 * API Configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_V1_PREFIX = '/api/v1';

/**
 * API Error Class
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorType?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * API Response Interface
 */
interface APIResponse<T = unknown> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  error_type?: string;
  details?: unknown;
}

/**
 * Request Options Interface
 */
interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Make an API request with Better Auth JWT
 */
async function request<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, headers = {}, ...fetchOptions } = options;

  // Build full URL
  const url = `${API_BASE_URL}${API_V1_PREFIX}${endpoint}`;

  // Prepare headers
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add Better Auth JWT token if required
  if (requiresAuth) {
    const authHeader = await getAuthHeader();
    Object.assign(requestHeaders, authHeader);
  }

  try {
    // Make the request
    const response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
    });

    // Parse response
    let data: APIResponse<T>;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    // Handle errors
    if (!response.ok) {
      // Handle 401 Unauthorized - JWT token expired or invalid
      // Don't auto-redirect here - let the auth context handle it
      if (response.status === 401) {
        console.warn('API request unauthorized - token may be expired');
      }

      throw new APIError(
        data.error || data.message || 'An error occurred',
        response.status,
        data.error_type,
        data.details
      );
    }

    // Return data (handle both wrapped and unwrapped responses)
    if (data.data !== undefined) {
      return data.data;
    }

    return data as T;
  } catch (error) {
    // Re-throw APIError
    if (error instanceof APIError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new APIError('Network error. Please check your connection.', 0);
    }

    // Handle other errors
    throw new APIError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500
    );
  }
}

/**
 * API Client Object
 */
export const api = {
  /**
   * GET request
   */
  get: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  /**
   * POST request
   */
  post: <T = unknown>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * PUT request
   */
  put: <T = unknown>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * PATCH request
   */
  patch: <T = unknown>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * DELETE request
   */
  delete: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

/**
 * Export API base URL for direct use
 */
export { API_BASE_URL, API_V1_PREFIX };
