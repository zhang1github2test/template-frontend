// stores/log.ts
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { logApi } from '@/api/log'
import type { LogItem, LogQueryParams } from '@/types/log'
import { ElMessage, ElMessageBox } from 'element-plus'
import { saveAs } from 'file-saver'

export const useLogStore = defineStore('log', () => {
    // 状态
    const logList = ref<LogItem[]>([])
    const loading = ref(false)
    const submitLoading = ref(false)
    const selectedLogIds = ref<number[]>([])

    // 分页信息
    const pagination = reactive({
        currentPage: 1,
        pageSize: 10,
        total: 0
    })

    // 搜索条件
    const searchForm = reactive<LogQueryParams>({
        status: undefined,
        pageNum: 1,
        pageSize: 10
    })

    /**
     * 获取日志列表
     */
    const fetchLogList = async () => {
        loading.value = true
        try {
            const params = {
                ...searchForm,
                pageNum: pagination.currentPage,
                pageSize: pagination.pageSize
            }
            const response = await logApi.getLogList(params)

            if (response.success) {
                logList.value = response.data.list
                pagination.total = response.data.total
                return response
            } else {
                ElMessage.error(response.message || '获取日志列表失败')
                return response
            }
        } catch (error) {
            ElMessage.error('获取日志列表失败')
            console.error('获取日志列表失败:', error)
            throw error
        } finally {
            loading.value = false
        }
    }


    /**
     * 根据ID获取日志详情
     */
    const getLogById = async (id: number) => {
        try {
            const response = await logApi.getLogById(id)
            if (response.success) {
                return response.data
            } else {
                ElMessage.error(response.message || '获取日志详情失败')
                return null
            }
        } catch (error) {
            ElMessage.error('获取日志详情失败')
            console.error('获取日志详情失败:', error)
            throw error
        }
    }

    /**
     * 删除日志
     */
    const deleteLog = async (id: number) => {
        try {
            await ElMessageBox.confirm('确定删除该日志吗？', '提示', {
                type: 'warning'
            })

            const response = await logApi.deleteLog(id)

            if (response.success) {
                ElMessage.success('删除日志成功')
                await fetchLogList() // 重新加载列表
                return response
            } else {
                ElMessage.error(response.message || '删除日志失败')
                return response
            }
        } catch (error: any) {
            if (error !== 'cancel') {
                ElMessage.error('删除日志失败')
                console.error('删除日志失败:', error)
            }
            throw error
        }
    }

    /**
     * 批量删除日志
     */
    const deleteLogs = async (ids: number[]) => {
        if (ids.length === 0) {
            ElMessage.warning('请先选择要删除的日志')
            return
        }

        try {
            await ElMessageBox.confirm(`确定删除选中的${ids.length}条日志吗？`, '提示', {
                type: 'warning'
            })

            const response = await logApi.deleteLogs(ids)

            if (response.success) {
                ElMessage.success('批量删除日志成功')
                selectedLogIds.value = [] // 清空选择
                await fetchLogList() // 重新加载列表
                return response
            } else {
                ElMessage.error(response.message || '批量删除日志失败')
                return response
            }
        } catch (error: any) {
            if (error !== 'cancel') {
                ElMessage.error('批量删除日志失败')
                console.error('批量删除日志失败:', error)
            }
            throw error
        }
    }

    /**
     * 清空日志
     */
    const cleanLogs = async () => {
        try {
            await ElMessageBox.confirm('确定清空所有日志吗？此操作不可恢复！', '提示', {
                type: 'warning'
            })

            const response = await logApi.cleanLogs()

            if (response.success) {
                ElMessage.success('清空日志成功')
                await fetchLogList() // 重新加载列表
                return response
            } else {
                ElMessage.error(response.message || '清空日志失败')
                return response
            }
        } catch (error: any) {
            if (error !== 'cancel') {
                ElMessage.error('清空日志失败')
                console.error('清空日志失败:', error)
            }
            throw error
        }
    }

    /**
     * 导出日志
     */
    const exportLogs = async () => {
        try {
            submitLoading.value = true
            const params = {
                ...searchForm
            }

            const blob = await logApi.exportLogs(params)
            saveAs(blob, `系统日志_${new Date().getTime()}.xlsx`)
            ElMessage.success('导出日志成功')
        } catch (error) {
            ElMessage.error('导出日志失败')
            console.error('导出日志失败:', error)
            throw error
        } finally {
            submitLoading.value = false
        }
    }

    /**
     * 设置分页信息
     */
    const setPagination = (currentPage: number, pageSize: number) => {
        pagination.currentPage = currentPage
        pagination.pageSize = pageSize
    }

    /**
     * 设置搜索条件
     */
    const setSearchForm = (params: Partial<LogQueryParams>) => {
        Object.assign(searchForm, params)
    }

    /**
     * 设置选中的日志ID
     */
    const setSelectedLogIds = (ids: number[]) => {
        selectedLogIds.value = ids
    }

    return {
        // 状态
        logList,
        loading,
        submitLoading,
        selectedLogIds,
        pagination,
        searchForm,

        // 方法
        fetchLogList,
        getLogById,
        deleteLog,
        deleteLogs,
        cleanLogs,
        exportLogs,
        setPagination,
        setSearchForm,
        setSelectedLogIds
    }
})
