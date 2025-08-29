// 登录表单
export interface LoginForm {
    username: string
    password: string
    remember?: boolean
}

// 用户信息
export interface UserInfo {
    id: number
    username: string
    email: string
    nickname: string
    avatar?: string
    roles: string[]
    permissions: string[]
    status: 'active' | 'inactive' | 'banned'
    createdAt: string
    updatedAt: string
}

// 登录响应
export interface LoginResponse {
    token: string
    userInfo: UserInfo
    expiresIn?: number
}

// API响应基础结构
export interface ApiResponse<T = any> {
    success: boolean
    data: T
    message: string
    code: number
}

// 权限相关类型
export interface Permission {
    id: number
    name: string
    code: string
    type: 'menu' | 'button' | 'api'
    parentId?: number
    path?: string
    component?: string
    icon?: string
    sort: number
    status: 'active' | 'inactive'
    children?: Permission[]
}

// 角色类型
export interface Role {
    id: number
    name: string
    code: string
    description?: string
    permissions: Permission[]
    status: 'active' | 'inactive'
    createdAt: string
    updatedAt: string
}

// 菜单类型
export interface Menu {
    id: number
    title: string
    path: string
    component?: string
    icon?: string
    parentId?: number
    sort: number
    hidden: boolean
    children?: Menu[]
}