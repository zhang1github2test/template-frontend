// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import type { LoginForm, UserInfo } from '@/types/auth'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { usePermissionStore } from '@/stores/permission'

// 存储键名
const TOKEN_KEY = 'admin-token'
const USER_INFO_KEY = 'user-info'

export const useAuthStore = defineStore('auth', () => {
    // 状态
    const token = ref<string>(localStorage.getItem(TOKEN_KEY) || '')
    const userInfo = ref<UserInfo | null>(JSON.parse(localStorage.getItem(USER_INFO_KEY) || 'null'))
    const isLoading = ref(false)

    // 计算属性
    const isAuthenticated = computed(() => !!token.value)

    // 保存认证信息到本地存储
    const saveAuthInfo = () => {
        if (token.value) {
            localStorage.setItem(TOKEN_KEY, token.value)
        } else {
            localStorage.removeItem(TOKEN_KEY)
        }

        if (userInfo.value) {
            localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo.value))
        } else {
            localStorage.removeItem(USER_INFO_KEY)
        }
    }

    // 清除本地存储的认证信息
    const clearAuthInfo = () => {
        token.value = ''
        userInfo.value = null
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_INFO_KEY)
    }

    // 登录
    const login = async (loginForm: LoginForm) => {
        try {
            isLoading.value = true
            const response = await authApi.login(loginForm)

            if (response.success) {
                token.value = response.data.token
                userInfo.value = response.data.userInfo

                // 保存到本地存储
                saveAuthInfo()

                ElMessage.success('登录成功')

                // 获取重定向路径
                const redirect = router.currentRoute.value.query.redirect as string
                await router.push(redirect || '/dashboard')

                return { success: true }
            } else {
                ElMessage.error(response.message || '登录失败')
                return { success: false, message: response.message }
            }
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || '登录失败'
            ElMessage.error(message)
            return { success: false, message }
        } finally {
            isLoading.value = false
        }
    }

    // 登出
    const logout = async () => {
        try {
            if (token.value) {
                await authApi.logout()
            }
        } catch (error) {
            console.warn('登出请求失败:', error)
        } finally {
            // 清除本地状态
            clearAuthInfo()

            // 重置权限路由
            const permissionStore = usePermissionStore()
            permissionStore.resetRoutes()

            ElMessage.success('已退出登录')

            // 跳转到登录页
            await router.push('/login')
        }
    }

    // 刷新用户信息
    const refreshUserInfo = async () => {
        if (!token.value) return

        try {
            const response = await authApi.getUserInfo()
            if (response.success) {
                userInfo.value = response.data
                // 更新本地存储
                saveAuthInfo()
                return response.data
            }
        } catch (error) {
            console.warn('获取用户信息失败:', error)
            // 如果获取用户信息失败，可能token已过期
            await logout()
            throw error
        }
    }

    // 检查认证状态
    const checkAuthStatus = async () => {
        // 这里可以添加token验证逻辑
        // 例如检查token是否过期，是否需要刷新等
        if (token.value && !userInfo.value) {
            await refreshUserInfo()
        }
    }

    // 更新Token
    const updateToken = (newToken: string) => {
        token.value = newToken
        saveAuthInfo()
    }

    // 更新用户信息
    const updateUserInfo = (newUserInfo: Partial<UserInfo>) => {
        if (userInfo.value) {
            userInfo.value = { ...userInfo.value, ...newUserInfo }
            saveAuthInfo()
        }
    }

    return {
        // 状态
        token: readonly(token),
        userInfo: readonly(userInfo),
        isLoading: readonly(isLoading),

        // 计算属性
        isAuthenticated,

        // 方法
        login,
        logout,
        refreshUserInfo,
        checkAuthStatus,
        updateToken,
        updateUserInfo
    }
})
