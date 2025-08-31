import request from '@/utils/request'
import type { ConfigItem, ConfigPageData } from '@/types/system'
import type { ApiResponse } from '@/types/auth'

export const configApi = {
    // 获取配置列表
    getConfigList: (params: any): Promise<ApiResponse<ConfigPageData>> => {
        return request.get('/api/system/config/list', { params })
    },

    // 根据ID获取配置详情
    getConfigById: (id: number): Promise<ApiResponse<ConfigItem>> => {
        return request.get(`/api/system/config/${id}`)
    },

    // 新增配置
    addConfig: (data: Omit<ConfigItem, 'id' | 'createTime'>): Promise<ApiResponse<ConfigItem>> => {
        return request.post('/api/system/config', data)
    },

    // 更新配置
    updateConfig: (data: ConfigItem): Promise<ApiResponse<ConfigItem>> => {
        return request.put('/api/system/config', data)
    },

    // 删除配置
    deleteConfig: (id: number): Promise<ApiResponse<ConfigItem>> => {
        return request.delete(`/api/system/config/${id}`)
    }
}