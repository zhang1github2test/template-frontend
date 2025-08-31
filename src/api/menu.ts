import request from '@/utils/request'
import type {ApiResponse} from "@/types/auth.ts";

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
    redirect?: string
    visible: boolean
}

// 添加搜索参数接口
export interface MenuSearchParam {
    name?: string
    type?: number
    visible?: boolean
}

export const menuApi = {
    getMenuTree: (): Promise<ApiResponse<MenuItem[]>> => {
        return request.get('api/menu/tree')
    },
    // 添加条件查询接口
    searchMenuTree: (params: MenuSearchParam): Promise<ApiResponse<MenuItem[]>> => {
        return request.get('api/menu/tree', {params} )
    },
    createMenu: (data: Partial<MenuItem>): Promise<ApiResponse<MenuItem>> => {
        return request.post('/api/menu',  data )
    },
    updateMenu: (id: number, data: Partial<MenuItem>): Promise<ApiResponse<MenuItem>> => {
        return request.put(`/api/menu/${id}`, data)
    },
    deleteMenu: (id: number): Promise<ApiResponse> => {
        return request.delete(`/api/menu/${id}`)
    },

}
