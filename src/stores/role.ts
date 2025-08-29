// src/stores/role.ts
import { defineStore } from 'pinia'
import { roleApi } from '@/api/role'
import { permissionApi } from '@/api/permission'
import type { Role, RoleQueryParams, Permission } from '@/types/role'

interface RoleState {
    roles: Role[]
    total: number
    currentPage: number
    pageSize: number
    permissionTree: Permission[]
    rolePermissions: Permission[]
    loading: boolean
}

export const useRoleStore = defineStore('role', {
    state: (): RoleState => ({
        roles: [],
        total: 0,
        currentPage: 1,
        pageSize: 10,
        permissionTree: [],
        rolePermissions: [],
        loading: false
    }),

    actions: {
        // 加载角色列表
        async loadRoles(params: RoleQueryParams) {
            this.loading = true
            try {
                const response = await roleApi.getRoleList(params)
                this.roles = response.data.list
                this.total = response.data.total
                this.currentPage = params.page || 1
                this.pageSize = params.size || 10
                return response
            } catch (error) {
                console.error('加载角色列表失败:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // 创建角色
        async createRole(roleData: Partial<Role>) {
            try {
                const response = await roleApi.createRole(roleData)
                // 创建成功后刷新列表
                await this.loadRoles({
                    page: this.currentPage,
                    size: this.pageSize
                })
                return response
            } catch (error) {
                console.error('创建角色失败:', error)
                throw error
            }
        },

        // 更新角色
        async updateRole(id: number, roleData: Partial<Role>) {
            try {
                const response = await roleApi.updateRole(id, roleData)
                // 更新成功后刷新列表
                await this.loadRoles({
                    page: this.currentPage,
                    size: this.pageSize
                })
                return response
            } catch (error) {
                console.error('更新角色失败:', error)
                throw error
            }
        },

        // 删除角色
        async deleteRole(id: number) {
            try {
                const response = await roleApi.deleteRole(id)
                // 删除成功后刷新列表
                await this.loadRoles({
                    page: this.currentPage,
                    size: this.pageSize
                })
                return response
            } catch (error) {
                console.error('删除角色失败:', error)
                throw error
            }
        },

        // 批量删除角色
        async batchDeleteRoles(ids: number[]) {
            try {
                const response = await roleApi.batchDeleteRoles(ids)
                // 删除成功后刷新列表
                await this.loadRoles({
                    page: this.currentPage,
                    size: this.pageSize
                })
                return response
            } catch (error) {
                console.error('批量删除角色失败:', error)
                throw error
            }
        },

        // 加载权限树
        async loadPermissionTree() {
            try {
                const response = await permissionApi.getPermissionTree()
                this.permissionTree = response.data
                return response
            } catch (error) {
                console.error('加载权限树失败:', error)
                throw error
            }
        },

        // 加载角色权限
        async loadRolePermissions(roleId: number) {
            try {
                const response = await roleApi.getRolePermissions(roleId)
                this.rolePermissions = response.data
                return response
            } catch (error) {
                console.error('加载角色权限失败:', error)
                throw error
            }
        },

        // 更新角色权限
        async updateRolePermissions(roleId: number, permissionIds: number[]) {
            try {
                const response = await roleApi.updateRolePermissions(roleId, permissionIds)
                // 更新成功后重新加载角色权限
                await this.loadRolePermissions(roleId)
                return response
            } catch (error) {
                console.error('更新角色权限失败:', error)
                throw error
            }
        },

        // 清空角色权限
        clearRolePermissions() {
            this.rolePermissions = []
        },

        // 重置状态
        reset() {
            this.roles = []
            this.total = 0
            this.currentPage = 1
            this.pageSize = 10
            this.permissionTree = []
            this.rolePermissions = []
            this.loading = false
        }
    },

    getters: {
        // 获取启用的角色
        activeRoles: (state) => {
            return state.roles.filter(role => role.status === 1)
        },

        // 根据ID获取角色
        getRoleById: (state) => {
            return (id: number) => state.roles.find(role => role.id === id)
        },

        // 是否有权限树数据
        hasPermissionTree: (state) => {
            return state.permissionTree.length > 0
        }
    }
})