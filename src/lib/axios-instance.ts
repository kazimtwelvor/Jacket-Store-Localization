import axios from 'axios'
import { getApiBaseURL, isCorsIssue, getCorsDebugInfo } from './config/api-config'

const apiClient = axios.create({
    baseURL: getApiBaseURL(),
    timeout: 1200000, 
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
})

apiClient.interceptors.request.use(
    (config) => {
        if (process.env.NODE_ENV === 'development') {
            config.headers['Access-Control-Allow-Origin'] = '*'
            config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        }
        
        // Add country code to all requests
        // Try to get from URL first (for server-side), then from localStorage (for client-side)
        if (typeof window !== 'undefined') {
            try {
                const countryStore = localStorage.getItem('country-storage')
                if (countryStore) {
                    const parsed = JSON.parse(countryStore)
                    const countryCode = parsed?.state?.selectedCountry?.countryCode
                    if (countryCode && !config.params?.cn) {
                        config.params = { ...config.params, cn: countryCode }
                    }
                }
            } catch (e) {
                // Ignore errors
            }
        }
        
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response) {
        } else if (error.request) {

            if (isCorsIssue(error)) {
                const debugInfo = getCorsDebugInfo(error)
                Object.entries(debugInfo).forEach(([key, value]) => {
                })
            }
        } else {
        }
        return Promise.reject(error)
    }
)

export default apiClient
