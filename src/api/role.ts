// src/api/role.ts
import request from '@/utils/request'
import type {
    Role,
    RoleQueryParams,
    RoleListResponse,
    Permission
} from '@/types/role'
import type { ApiResponse } from '@/types/auth'

export const roleApi = {
    // 获取角色列表
    getRoleList: (params: RoleQueryParams): Promise<ApiResponse<RoleListResponse>> => {
        return request.get('/api/roles', { params })
    },

    // 创建角色
    createRole: (data: Partial<Role>): Promise<ApiResponse<Role>> => {
        return request.post('/api/roles', data)
    },

    // 更新角色
    updateRole: (id: number, data: Partial<Role>): Promise<ApiResponse<Role>> => {
        return request.put(`/api/roles/${id}`, data)
    },

    // 删除角色
    deleteRole: (id: number): Promise<ApiResponse> => {
        return request.delete(`/api/roles/${id}`)
    },

    // 批量删除角色
    batchDeleteRoles: (ids: number[]): Promise<ApiResponse> => {
        return request.delete('/api/roles/batch', { data: { ids } })
    },

    // 获取角色权限
    getRolePermissions: (roleId: number): Promise<ApiResponse<Permission[]>> => {
        return request.get(`/api/roles/${roleId}/permissions`)
    },

    // 更新角色权限
    updateRolePermissions: (roleId: number, permissionIds: number[]): Promise<ApiResponse> => {
        return request.put(`/api/roles/${roleId}/permissions`, { permissionIds })
    }
}