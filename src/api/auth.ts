import request from '@/utils/request'
import type { LoginForm, LoginResponse, UserInfo, ApiResponse } from '@/types/auth'

export const authApi = {
    // 登录
    login: (data: LoginForm): Promise<ApiResponse<LoginResponse>> => {
        return request.post('/api/auth/login', data)
    },

    // 登出
    logout: (): Promise<ApiResponse> => {
        return request.post('/api/auth/logout')
    },

    // 获取用户信息
    getUserInfo: (): Promise<ApiResponse<UserInfo>> => {
        return request.get('/api/auth/user')
    },

    // 刷新token
    refreshToken: (): Promise<ApiResponse<{ token: string }>> => {
        return request.post('/api/auth/refresh')
    },

    // 修改密码
    changePassword: (data: { oldPassword: string, newPassword: string }): Promise<ApiResponse> => {
        return request.post('/api/auth/change-password', data)
    }
}