import request from '@/utils/request'

export interface MenuItem {
    id: number
    name: string
    path: string
    component?: string
    meta?: {
        title?: string
        requiresAuth?: boolean
        hidden?: boolean
        icon?: string
        permissions?: string[]
        roles?: string[]
        keepAlive?: boolean
        affix?: boolean
        breadcrumb?: boolean
        activeMenu?: string
    }
    children?: MenuItem[]
    sort?: number
    parentId?: number
    type: number // 1: 目录, 2: 菜单, 3: 按钮
    permission?: string
    visible: boolean
}

// 查询菜单树
export function getMenuTree() {
    return request.get<MenuItem[]>('/api/menu/tree')
}

// 新增菜单
export function createMenu(data: Partial<MenuItem>) {
    return request.post('/api/menu', data)
}

// 更新菜单
export function updateMenu(id: number, data: Partial<MenuItem>) {
    return request.put(`/api/menu/${id}`, data)
}

// 删除菜单
export function deleteMenu(id: number) {
    return request.delete(`/api/menu/${id}`)
}
