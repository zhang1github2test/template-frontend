export interface Resource {
    id: number
    resource_name: string
    permission_code: string
    desc?: string
    type: string
    resource_path?: string
    http_method?: string
    parent_id?: number
    sort: number
    status: number
    requires_auth: number
    remark?: string
    created_by?: number
    created_at: string
    updated_by?: number
    updated_at: string
}

export interface CreateResourceRequest {
    resource_name: string
    permission_code: string
    desc?: string
    type: string
    resource_path?: string
    http_method?: string
    parent_id?: number
    sort?: number
    requires_auth?: number
    remark?: string
    created_by?: number
}

export interface UpdateResourceRequest {
    resource_name?: string
    permission_code?: string
    desc?: string
    type?: string
    resource_path?: string
    http_method?: string
    parent_id?: number
    sort?: number
    status?: number
    requires_auth?: number
    remark?: string
    updated_by?: number
}

export interface ResourceQueryRequest {
    id?: number
    resource_name?: string
    permission_code?: string
    type?: string
    resource_path?: string
    http_method?: string
    parent_id?: number
    status?: number
    requires_auth?: number
    page?: number
    page_size?: number
}

export interface PagedResponse<T> {
    data: T[]
    total: number
    page: number
    page_size: number
    total_pages: number
}



// 常量定义
export const RESOURCE_TYPES = [
    { label: '菜单', value: 'MENU' },
    { label: '按钮', value: 'BUTTON' },
    { label: 'API', value: 'API' }
]

export const HTTP_METHODS = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' },
    { label: 'PATCH', value: 'PATCH' }
]

export const STATUS_OPTIONS = [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 }
]

export const AUTH_OPTIONS = [
    { label: '需要', value: 1 },
    { label: '不需要', value: 0 }
]
