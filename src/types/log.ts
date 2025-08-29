// types/log.ts
export interface LogItem {
    id: number
    title: string
    businessType: string
    method: string
    requestMethod: string
    operatorType: string
    operatorName: string
    deptName: string
    operUrl: string
    operIp: string
    operLocation: string
    operParam: string
    jsonResult: string
    status: number // 0=正常, 1=异常
    errorMsg: string
    operTime: string
    costTime: number
}

export interface LogQueryParams {
    title?: string
    businessType?: string
    status?: number
    operatorName?: string
    operTime?: [string, string] // 时间范围
    pageNum: number
    pageSize: number
}

export interface LogPageData {
    rows: LogItem[]
    total: number
}
