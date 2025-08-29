// src/api/user.ts
import request from '@/utils/request'
import type {
    User,
    UserListResponse,
    UserCreateForm,
    UserUpdateForm,
    UserQueryParams,
} from '@/types/user'

import type { ApiResponse } from '@/types/auth'

export const userApi = {
    // 获取用户列表
    getList: (params: UserQueryParams): Promise<ApiResponse<UserListResponse>> => {
        return request.get('/api/users', { params })
    },

    // 根据ID获取用户
    getById: (id: string): Promise<ApiResponse<User>> => {
        return request.get(`/api/users/${id}`)
    },

    // 创建用户
    create: (data: UserCreateForm): Promise<ApiResponse<User>> => {
        return request.post('/api/users', data)
    },

    // 更新用户
    update: (id: string, data: UserUpdateForm): Promise<ApiResponse<User>> => {
        return request.put(`/api/users/${id}`, data)
    },

    // 删除用户
    delete: (id: string): Promise<ApiResponse> => {
        return request.delete(`/api/users/${id}`)
    }
}