// types/log.ts
export interface LogItem {
    id: number
    timestamp: string
    method: string
    path: string
    query: string
    ip: string
    userAgent: string
    status: number
    latency: number
    handler: string
    request: any
    response: any
    errors: string[]
    contentLength: number
    truncated: boolean
    createdAt: string
    updatedAt: string
}

export interface LogQueryParams {
    method?: string
    path?: string
    status?: number
    ip?: string
    handler?: string
    timestamp?: [string, string] // 时间范围
    pageNum: number
    pageSize: number
}

export interface LogPageData {
    list: LogItem[]
    total: number
}
