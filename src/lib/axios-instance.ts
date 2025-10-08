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
