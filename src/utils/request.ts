import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// 创建axios实例
const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
})

// 请求拦截器
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const authStore = useAuthStore()

        // 添加token到请求头
        if (authStore.token) {
            config.headers.Authorization = `Bearer ${authStore.token}`
        }

        return config
    },
    (error) => {
        console.error('请求错误:', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    (response: AxiosResponse) => {
        const { data } = response

        // 如果返回的状态码为2xx，说明接口请求成功，可以正常拿到数据
        if (response.status >= 200 && response.status < 300) {
            return data
        }

        // 其他情况均视为错误
        ElMessage.error(data.message || '请求失败')
        return Promise.reject(new Error(data.message || '请求失败'))
    },
    async (error) => {
        const { response } = error
        const authStore = useAuthStore()

        if (response) {
            const { status, data } = response

            switch (status) {
                case 401:
                    // Token过期或无效
                    ElMessageBox.confirm('登录状态已过期，请重新登录', '提示', {
                        confirmButtonText: '重新登录',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        authStore.logout()
                    }).catch(() => {
                        // 用户取消，也需要清除token
                        authStore.updateToken('')
                        router.push('/login')
                    })
                    break
                case 403:
                    ElMessage.error('没有权限访问该资源')
                    break
                case 404:
                    ElMessage.error('请求的资源不存在')
                    break
                case 500:
                    ElMessage.error('服务器内部错误')
                    break
                default:
                    ElMessage.error(data?.message || `请求失败，状态码：${status}`)
            }
        } else if (error.code === 'ECONNABORTED') {
            ElMessage.error('请求超时，请检查网络连接')
        } else {
            ElMessage.error('网络错误，请检查网络连接')
        }

        return Promise.reject(error)
    }
)

export default request