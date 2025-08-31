import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {menuApi, type MenuSearchParam} from '@/api/menu'
import type { MenuItem } from '@/api/menu'

export const useMenuStore = defineStore('menu', () => {
    // 状态
    const menuTree = ref<MenuItem[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const searchParams = ref<MenuSearchParam>({}) // 添加搜索参数状态

    // 计算属性
    const flatMenuList = computed(() => {
        const flatten = (menus: MenuItem[]): MenuItem[] => {
            let result: MenuItem[] = []

            menus.forEach(menu => {
                result.push(menu)
                if (menu.children && menu.children.length > 0) {
                    result = result.concat(flatten(menu.children))
                }
            })

            return result
        }

        return flatten(menuTree.value)
    })

    // 根据类型获取菜单
    const getMenusByType = computed(() => (type: number) => {
        return flatMenuList.value.filter(menu => menu.type === type)
    })

    // 获取目录菜单（用作父级选项）
    const directoryMenus = computed(() => {
        return getMenusByType.value(1) // type: 1 为目录
    })

    // 查找菜单项
    const findMenuById = (id: number): MenuItem | null => {
        const findInTree = (menus: MenuItem[]): MenuItem | null => {
            for (const menu of menus) {
                if (menu.id === id) {
                    return menu
                }
                if (menu.children) {
                    const found = findInTree(menu.children)
                    if (found) return found
                }
            }
            return null
        }

        return findInTree(menuTree.value)
    }

    // Actions
    const fetchMenuTree = async () => {
        try {
            loading.value = true
            error.value = null

            const response = await menuApi.getMenuTree()
            menuTree.value = response.data || []

            return response.data
        } catch (err) {
            error.value = '获取菜单数据失败'
            console.error('获取菜单树失败:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    // 添加条件查询方法
    const searchMenuTree = async (params: MenuSearchParam = {}) => {
        try {
            loading.value = true
            error.value = null
            searchParams.value = params

            const response = await menuApi.searchMenuTree(params)
            menuTree.value = response.data || []

            return response.data
        } catch (err) {
            error.value = '获取菜单数据失败'
            console.error('条件查询菜单失败:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const createNewMenu = async (menuData: Partial<MenuItem>) => {
        try {
            loading.value = true
            error.value = null
            debugger
            // 清理不需要的字段
            const cleanData = cleanMenuData(menuData)

            const response = await menuApi.createMenu(cleanData)

            // 重新获取菜单树以更新状态
            if (Object.keys(searchParams.value).length > 0) {
                // 如果之前有搜索条件，则重新搜索
                await searchMenuTree(searchParams.value)
            } else {
                // 否则获取完整菜单树
                await fetchMenuTree()
            }

            return response
        } catch (err) {
            error.value = '创建菜单失败'
            console.error('创建菜单失败:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateExistingMenu = async (id: number, menuData: Partial<MenuItem>) => {
        try {
            loading.value = true
            error.value = null

            // 清理不需要的字段
            const cleanData = cleanMenuData(menuData)
            debugger
            const response = await menuApi.updateMenu(id, cleanData)

            // 重新获取菜单树以更新状态
            if (Object.keys(searchParams.value).length > 0) {
                // 如果之前有搜索条件，则重新搜索
                await searchMenuTree(searchParams.value)
            } else {
                // 否则获取完整菜单树
                await fetchMenuTree()
            }

            return response
        } catch (err) {
            error.value = '更新菜单失败'
            console.error('更新菜单失败:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteExistingMenu = async (id: number) => {
        try {
            loading.value = true
            error.value = null

            // 检查是否有子菜单
            const menu = findMenuById(id)
            if (menu && menu.children && menu.children.length > 0) {
                throw new Error('存在子菜单，无法删除')
            }

            const response = await menuApi.deleteMenu(id)

            // 重新获取菜单树以更新状态
            if (Object.keys(searchParams.value).length > 0) {
                // 如果之前有搜索条件，则重新搜索
                await searchMenuTree(searchParams.value)
            } else {
                // 否则获取完整菜单树
                await fetchMenuTree()
            }

            return response
        } catch (err) {
            error.value = err instanceof Error ? err.message : '删除菜单失败'
            console.error('删除菜单失败:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    // 辅助方法：清理菜单数据
    const cleanMenuData = (menuData: Partial<MenuItem>) => {
        const cleanData: any = { ...menuData }

        // 移除不需要提交的字段
        delete cleanData.id
        delete cleanData.children

        // 清理 meta 对象中的空值
        if (cleanData.meta) {
            Object.keys(cleanData.meta).forEach(key => {
                if (cleanData.meta[key] === '' || cleanData.meta[key] === null || cleanData.meta[key] === undefined) {
                    delete cleanData.meta[key]
                }
            })

            // 如果 meta 为空对象，则删除
            if (Object.keys(cleanData.meta).length === 0) {
                delete cleanData.meta
            }
        }

        // 根据菜单类型清理不需要的字段
        if (cleanData.type === 3) { // 按钮类型
            delete cleanData.path
            delete cleanData.component
            if (cleanData.meta) {
                delete cleanData.meta.keepAlive
                delete cleanData.meta.affix
            }
        } else if (cleanData.type === 1) { // 目录类型
            if (cleanData.meta) {
                delete cleanData.meta.keepAlive
                delete cleanData.meta.affix
            }
        }

        return cleanData
    }

    // 批量操作方法
    const batchUpdateMenus = async (menus: Array<{ id: number; data: Partial<MenuItem> }>) => {
        try {
            loading.value = true
            error.value = null

            const promises = menus.map(({ id, data }) => menuApi.updateMenu(id, cleanMenuData(data)))
            await Promise.all(promises)

            // 重新获取菜单树
            if (Object.keys(searchParams.value).length > 0) {
                // 如果之前有搜索条件，则重新搜索
                await searchMenuTree(searchParams.value)
            } else {
                // 否则获取完整菜单树
                await fetchMenuTree()
            }
        } catch (err) {
            error.value = '批量更新菜单失败'
            console.error('批量更新菜单失败:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const batchDeleteMenus = async (ids: number[]) => {
        try {
            loading.value = true
            error.value = null

            // 检查所有菜单是否可以删除
            for (const id of ids) {
                const menu = findMenuById(id)
                if (menu && menu.children && menu.children.length > 0) {
                    throw new Error(`菜单 "${menu.name}" 存在子菜单，无法删除`)
                }
            }

            const promises = ids.map(id => menuApi.deleteMenu(id))
            await Promise.all(promises)

            // 重新获取菜单树
            if (Object.keys(searchParams.value).length > 0) {
                // 如果之前有搜索条件，则重新搜索
                await searchMenuTree(searchParams.value)
            } else {
                // 否则获取完整菜单树
                await fetchMenuTree()
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : '批量删除菜单失败'
            console.error('批量删除菜单失败:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    // 重置状态
    const resetState = () => {
        menuTree.value = []
        loading.value = false
        error.value = null
        searchParams.value = {}
    }

    // 清除错误
    const clearError = () => {
        error.value = null
    }

    return {
        // 状态
        menuTree,
        loading,
        error,
        searchParams,

        // 计算属性
        flatMenuList,
        getMenusByType,
        directoryMenus,

        // 方法
        fetchMenuTree,
        searchMenuTree, // 导出搜索方法
        createMenu: createNewMenu,
        updateMenu: updateExistingMenu,
        deleteMenu: deleteExistingMenu,
        findMenuById,
        batchUpdateMenus,
        batchDeleteMenus,
        resetState,
        clearError
    }
})
