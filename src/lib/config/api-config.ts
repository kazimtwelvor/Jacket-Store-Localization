export const API_CONFIG = {
  // Base URL for the external API
  EXTERNAL_API_URL: process.env.NEXT_PUBLIC_API_URL,
  
  // Development settings
  DEVELOPMENT: {
    // Use local API proxy in development to avoid CORS
    USE_LOCAL_PROXY: true,
    LOCAL_PROXY_BASE: '/api',
  },
  
  // Production settings
  PRODUCTION: {
    // Use external API directly in production
    USE_LOCAL_PROXY: false,
  },
  
  // Request settings
  REQUEST: {
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  },
  
  // CORS settings
  CORS: {
    ALLOWED_ORIGINS: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://your-production-domain.com',
    ],
    ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization'],
  },
}

// Helper function to get the appropriate base URL
export const getApiBaseURL = (): string => {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isClient = typeof window !== 'undefined'
  
  if (isDevelopment && isClient && API_CONFIG.DEVELOPMENT.USE_LOCAL_PROXY) {
    return API_CONFIG.DEVELOPMENT.LOCAL_PROXY_BASE
  }
  
  return API_CONFIG.EXTERNAL_API_URL || ''
}

// Helper function to check if CORS is likely the issue
export const isCorsIssue = (error: any): boolean => {
  return (
    error.code === 'ERR_NETWORK' ||
    error.message.includes('Network Error') ||
    error.message.includes('CORS') ||
    (error.response && error.response.status === 0)
  )
}

// Debug information for CORS issues
export const getCorsDebugInfo = (error: any) => {
  return {
    frontendUrl: typeof window !== 'undefined' ? window.location.origin : 'Server-side',
    apiUrl: API_CONFIG.EXTERNAL_API_URL,
    requestUrl: error.config?.url,
    baseURL: error.config?.baseURL,
    environment: process.env.NODE_ENV,
    isClient: typeof window !== 'undefined',
    useLocalProxy: API_CONFIG.DEVELOPMENT.USE_LOCAL_PROXY,
  }
}
