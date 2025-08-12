import axios from 'axios'
import { getApiBaseURL, isCorsIssue, getCorsDebugInfo } from './config/api-config'

const apiClient = axios.create({
    baseURL: getApiBaseURL(),
    timeout: 10000,
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
            console.error('API Error Response:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                url: error.config?.url
            })
        } else if (error.request) {
            console.error('Network Error (CORS likely):', {
                message: error.message,
                code: error.code,
                url: error.config?.url,
                baseURL: error.config?.baseURL
            })

            if (isCorsIssue(error)) {
                console.error('🔍 CORS Debug Info:')
                const debugInfo = getCorsDebugInfo(error)
                Object.entries(debugInfo).forEach(([key, value]) => {
                    console.error(`   - ${key}:`, value)
                })
                console.error('   - Solution: Using local API proxy to avoid CORS issues')
            }
        } else {
            console.error('Axios Error:', error.message)
        }
        return Promise.reject(error)
    }
)

export default apiClient
