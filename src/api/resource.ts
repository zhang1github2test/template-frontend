import request from '@/utils/request'
import type {
    Resource,
    CreateResourceRequest,
    UpdateResourceRequest,
    ResourceQueryRequest,
    PagedResponse,
} from '@/types/resource'
import type { ApiResponse } from '@/types/auth'

export const resourceApi = {
    // 创建资源
    create(data: CreateResourceRequest): Promise<ApiResponse<Resource>> {
        return request.post('/api/resources', data)
    },

    // 获取资源详情
    getById(id: number): Promise<ApiResponse<Resource>> {
        return request.get(`/api/resources/${id}`)
    },

    // 更新资源
    update(id: number, data: UpdateResourceRequest): Promise<ApiResponse<Resource>> {
        return request.put(`/api/resources/${id}`, data)
    },

    // 删除资源
    delete(id: number): Promise<ApiResponse> {
        return request.delete(`/api/resources/${id}`)
    },

    // 查询资源列表
    list(params?: ResourceQueryRequest): Promise<ApiResponse<PagedResponse<Resource>>> {
        return request.get('/api/resources', { params })
    },
    // 查询资源树形结构
    resourceTree(params?: ResourceQueryRequest): Promise<ApiResponse<Resource[]>> {
        return request.get('/api/resources/tree', { params })
    }
}
