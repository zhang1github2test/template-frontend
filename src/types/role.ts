// src/types/role.ts
import type { ApiResponse } from './auth'

export interface Role {
    id: number
    roleName: string
    roleCode: string
    roleDesc: string
    status: number // 1: 启用, 0: 0
    createTime: string
    updateTime: string
}

export interface RoleQueryParams {
    roleName?: string
    roleCode?: string
    status?: number
    page: number
    size: number
}

export interface RoleListResponse {
    list: Role[]
    total: number
    page: number
    size: number
}

export interface Permission {
    id: number
    name: string
    code: string
    type: number // 1: 菜单, 2: 按钮
    parentId: number
    path?: string
    component?: string
    icon?: string
    children?: Permission[]
}