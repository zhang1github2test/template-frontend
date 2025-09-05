// stores/system.ts
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { configApi } from '@/api/system'
import type { ConfigItem } from '@/types/system'
import { ElMessage } from 'element-plus'

export const useSystemStore = defineStore('system', () => {
    // 状态
    const configList = ref<ConfigItem[]>([])
    const loading = ref(false)
    const submitLoading = ref(false)

    // 分页信息
    const pagination = reactive({
        currentPage: 1,
        pageSize: 10,
        total: 0
    })

    // 搜索条件
    const searchForm = reactive({
        configKey: '',
        configName: ''
    })

    /**
     * 获取配置列表
     */
    const fetchConfigList = async () => {
        loading.value = true
        try {
            const params = {
                ...searchForm,
                pageNum: pagination.currentPage,
                pageSize: pagination.pageSize
            }

            const response = await configApi.getConfigList(params)

            if (response.success) {
                configList.value = response.data.list
                pagination.total = response.data.total
                return response
            } else {
                ElMessage.error(response.message || '获取配置列表失败')
                return response
            }
        } catch (error) {
            ElMessage.error('获取配置列表失败')
            console.error('获取配置列表失败:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * 重置搜索条件
     */
    const resetSearch = () => {
        searchForm.configKey = ''
        searchForm.configName = ''
        pagination.currentPage = 1
    }

    /**
     * 根据ID获取配置详情
     */
    const getConfigById = async (id: number) => {
        try {
            const response = await configApi.getConfigById(id)
            if (response.success) {
                return response.data
            } else {
                ElMessage.error(response.message || '获取配置详情失败')
                return null
            }
        } catch (error) {
            ElMessage.error('获取配置详情失败')
            console.error('获取配置详情失败:', error)
            throw error
        }
    }

    /**
     * 新增配置
     */
    const addConfig = async (data: Omit<ConfigItem, 'id' | 'createTime'>) => {
        submitLoading.value = true
        try {
            const response = await configApi.addConfig(data)

            if (response.success) {
                ElMessage.success('新增配置成功')
                await fetchConfigList() // 重新加载列表
                return response
            } else {
                ElMessage.error(response.message || '新增配置失败')
                return response
            }
        } catch (error) {
            ElMessage.error('新增配置失败')
            console.error('新增配置失败:', error)
            throw error
        } finally {
            submitLoading.value = false
        }
    }

    /**
     * 更新配置
     */
    const updateConfig = async (data: ConfigItem) => {
        submitLoading.value = true
        try {
            const response = await configApi.updateConfig(data)

            if (response.success) {
                ElMessage.success('更新配置成功')
                await fetchConfigList() // 重新加载列表
                return response
            } else {
                ElMessage.error(response.message || '更新配置失败')
                return response
            }
        } catch (error) {
            ElMessage.error('更新配置失败')
            console.error('更新配置失败:', error)
            throw error
        } finally {
            submitLoading.value = false
        }
    }

    /**
     * 删除配置
     */
    const deleteConfig = async (id: number) => {
        try {
            const response = await configApi.deleteConfig(id)

            if (response.success) {
                ElMessage.success('删除配置成功')
                await fetchConfigList() // 重新加载列表
                return response
            } else {
                ElMessage.error(response.message || '删除配置失败')
                return response
            }
        } catch (error) {
            ElMessage.error('删除配置失败')
            console.error('删除配置失败:', error)
            throw error
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
    const setSearchForm = (key: string, name: string) => {
        searchForm.configKey = key
        searchForm.configName = name
    }

    return {
        // 状态
        configList,
        loading,
        submitLoading,
        pagination,
        searchForm,

        // 方法
        fetchConfigList,
        resetSearch,
        getConfigById,
        addConfig,
        updateConfig,
        deleteConfig,
        setPagination,
        setSearchForm
    }
})
