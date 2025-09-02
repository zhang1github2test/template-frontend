// src/stores/resource.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { resourceApi } from '@/api/resource'
import type {
    Resource,
    CreateResourceRequest,
    UpdateResourceRequest,
    ResourceQueryRequest,
} from '@/types/resource'
import {ApiResponse} from "@/types/auth.ts";

export const useResourceStore = defineStore('resource', () => {
    // 状态
    const resources = ref<Resource[]>([])
    const total = ref(0)
    const loading = ref(false)
    const currentResource = ref<Resource | null>(null)

    // 计算属性
    const resourceOptions = computed(() =>
        resources.value
            .filter(item => item.type === 'MENU')
            .map(item => ({
                label: item.resource_name,
                value: item.id
            }))
    )

    // 查询资源列表
    const fetchResources = async (params?: ResourceQueryRequest) => {
        try {
            loading.value = true
            const response = await resourceApi.resourceTree(params)
            resources.value = response.data
        } catch (error) {
            console.error('获取资源列表失败:', error)
        } finally {
            loading.value = false
        }
    }

    // 查询资源列表
    const loadResources = async (params?: ResourceQueryRequest) => {
        try {
            loading.value = true
            const response = await resourceApi.resourceTree(params)
            return response.data
        } catch (error) {
            console.error('获取资源列表失败:', error)
        } finally {
            loading.value = false
        }
    }

    // 创建资源
    const createResource = async (data: CreateResourceRequest) => {
        try {
            loading.value = true
            await resourceApi.create(data)
            ElMessage.success('创建成功')
            return true
        } catch (error) {
            console.error('创建资源失败:', error)
            return false
        } finally {
            loading.value = false
        }
    }

    // 获取资源详情
    const getResource = async (id: number) => {
        try {
            loading.value = true
            const response = await resourceApi.getById(id)
            currentResource.value = response.data
            return response.data
        } catch (error) {
            console.error('获取资源详情失败:', error)
            return null
        } finally {
            loading.value = false
        }
    }

    // 更新资源
    const updateResource = async (id: number, data: UpdateResourceRequest) => {
        try {
            loading.value = true
            await resourceApi.update(id, data)
            ElMessage.success('更新成功')
            return true
        } catch (error) {
            console.error('更新资源失败:', error)
            return false
        } finally {
            loading.value = false
        }
    }

    // 删除资源
    const deleteResource = async (id: number) => {
        try {
            loading.value = true
            await resourceApi.delete(id)
            ElMessage.success('删除成功')
            return true
        } catch (error) {
            console.error('删除资源失败:', error)
            return false
        } finally {
            loading.value = false
        }
    }

    // 重置状态
    const resetStore = () => {
        resources.value = []
        total.value = 0
        currentResource.value = null
    }

    return {
        // 状态
        resources,
        total,
        loading,
        currentResource,
        // 计算属性
        resourceOptions,
        // 方法
        fetchResources,
        createResource,
        getResource,
        updateResource,
        deleteResource,
        resetStore,
        loadResources
    }
})