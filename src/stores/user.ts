// src/stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '@/api/user'
import type { User, UserQueryParams, UserCreateForm, UserUpdateForm } from '@/types/user'

export const useUserStore = defineStore('user', () => {
    // 状态
    const users = ref<User[]>([])
    const loading = ref(false)
    const currentUser = ref<User | null>(null)
    const total = ref(0)
    const queryParams = ref<UserQueryParams>({
        page: 1,
        pageSize: 10,
        username: '',
        nickname: '',
        status: undefined
    })

    // 计算属性
    const userList = computed(() => users.value)

    // 获取用户列表
    const fetchUsers = async (params?: UserQueryParams) => {
        loading.value = true
        try {
            const searchParams = params || queryParams.value
            const response = await userApi.getList(searchParams)
            users.value = response.data.list
            total.value = response.data.total
            return response.data
        } catch (error) {
            console.error('获取用户列表失败:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    // 根据ID获取用户
    const getUserById = async (id: string) => {
        loading.value = true
        try {
            const response = await userApi.getById(id)
            currentUser.value = response.data
            return response.data
        } catch (error) {
            console.error('获取用户详情失败:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    // 创建用户
    const createUser = async (userData: UserCreateForm) => {
        loading.value = true
        try {
            const response = await userApi.create(userData)
            await fetchUsers() // 重新获取列表
            return response.data
        } catch (error) {
            console.error('创建用户失败:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    // 更新用户
    const updateUser = async (id: string, userData: UserUpdateForm) => {
        loading.value = true
        try {
            const response = await userApi.update(id, userData)
            await fetchUsers() // 重新获取列表
            if (currentUser.value?.id === id) {
                currentUser.value = response.data
            }
            return response.data
        } catch (error) {
            console.error('更新用户失败:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    // 删除用户
    const deleteUser = async (id: string) => {
        loading.value = true
        try {
            const response = await userApi.delete(id)
            await fetchUsers() // 重新获取列表
            if (currentUser.value?.id === id) {
                currentUser.value = null
            }
            return response.data
        } catch (error) {
            console.error('删除用户失败:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    // 更新查询参数
    const updateQueryParams = (params: Partial<UserQueryParams>) => {
        queryParams.value = { ...queryParams.value, ...params }
    }

    // 重置查询参数
    const resetQueryParams = () => {
        queryParams.value = {
            page: 1,
            pageSize: 10,
            username: '',
            nickname: '',
            status: undefined
        }
    }

    // 重置状态
    const reset = () => {
        users.value = []
        currentUser.value = null
        loading.value = false
        total.value = 0
        resetQueryParams()
    }

    return {
        // 状态
        users,
        currentUser,
        loading,
        total,
        queryParams,

        // 计算属性
        userList,

        // 方法
        fetchUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
        updateQueryParams,
        resetQueryParams,
        reset
    }
})