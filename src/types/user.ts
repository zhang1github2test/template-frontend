// src/types/user.ts

// 用户基本信息
export interface User {
    id: string
    username: string
    nickname: string
    email: string
    roles: string[]
    phone: string
    gender: string
    status: number
    createdAt: string
    updatedAt: string
}

// 用户列表响应
export interface UserListResponse {
    list: User[]
    total: number
    page: number
    pageSize: number
}

// 用户查询参数
export interface UserQueryParams {
    page: number
    pageSize: number
    username?: string
    nickname?: string
    email?: string
    status?: number
}

// 创建用户表单
export interface UserCreateForm {
    username: string
    nickname: string
    email: string
    phone: string
    gender: string
    status: number
    password: string
}

// 更新用户表单
export interface UserUpdateForm {
    nickname?: string
    email?: string
    phone?: string
    gender?: string
    status?: number
}