// api/log.ts
import request from '@/utils/request'
import type { ApiResponse } from '@/types/auth'
import type { LogItem, LogQueryParams, LogPageData } from '@/types/log'

export const logApi = {
    // 获取日志列表
    getLogList: (params: LogQueryParams): Promise<ApiResponse<LogPageData>> => {
        return request.get('/api/system/log/list', { params })
    },

    // 根据ID获取日志详情
    getLogById: (id: number): Promise<ApiResponse<LogItem>> => {
        return request.get(`/api/system/log/${id}`)
    },

    // 删除日志
    deleteLog: (id: number): Promise<ApiResponse> => {
        return request.delete(`/api/system/log/${id}`)
    },

    // 批量删除日志
    deleteLogs: (ids: number[]): Promise<ApiResponse> => {
        return request.delete('/api/system/log', { data: { ids } })
    },

    // 清空日志
    cleanLogs: (): Promise<ApiResponse> => {
        return request.delete('/api/system/log/clean')
    },

    // 导出日志
    exportLogs: (params: LogQueryParams): Promise<Blob> => {
        return request.post('/api/system/log/export', params, {
            responseType: 'blob'
        })
    }
}
