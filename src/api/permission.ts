// src/api/permission.ts
import request from '@/utils/request'
import type { Permission } from '@/types/role'
import type { ApiResponse } from '@/types/auth'

export const permissionApi = {
    // 获取权限树
    getPermissionTree: (): Promise<ApiResponse<Permission[]>> => {
        return request.get('/api/permissions/tree')
    }
}