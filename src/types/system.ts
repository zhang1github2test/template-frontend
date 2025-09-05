// 定义配置项接口
export interface ConfigItem {
    id: number
    configKey: string
    configName: string
    configValue: string
    configType: string // Y=系统内置, N=自定义
    remark: string
    createTime: string
}

// 定义分页响应数据接口
export interface ConfigPageData {
    list: ConfigItem[]
    total: number
}