import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { constantRoutes, asyncRoutes } from '@/router/routes'
import type { UserInfo } from '@/types/auth'
import { hasAnyPermission } from '@/utils/permission'

export const usePermissionStore = defineStore('permission', () => {
    // 状态
    const routes = ref<RouteRecordRaw[]>([])
    const addRoutes = ref<RouteRecordRaw[]>([])
    const isRoutesGenerated = ref(false)

    /**
     * 判断是否有权限访问路由
     */
    const hasPermission = (permissions: string[], route: RouteRecordRaw): boolean => {
        if (route.meta && route.meta.permissions) {
            // 需要检查权限
            const routePermissions = route.meta.permissions as string[]
            // 检查用户是否有路由所需的任一权限
            return hasAnyPermission(permissions, routePermissions)
        } else {
            // 没有权限要求的路由，默认可以访问
            return true
        }
    }

    /**
     * 根据角色判断是否有权限
     */
    const hasRole = (roles: string[], route: RouteRecordRaw): boolean => {
        if (route.meta && route.meta.roles) {
            const routeRoles = route.meta.roles as string[]
            return roles.some(role => routeRoles.includes(role))
        } else {
            return true
        }
    }

    /**
     * 递归过滤异步路由表，返回符合用户权限的路由表
     */
    const filterAsyncRoutes = (routes: RouteRecordRaw[], userInfo: UserInfo): RouteRecordRaw[] => {
        const accessedRoutes: RouteRecordRaw[] = []

        routes.forEach(route => {
            const tmp = { ...route }

            // 检查权限
            const hasPermissionAccess = hasPermission(userInfo.permissions, tmp)
            const hasRoleAccess = hasRole(userInfo.roles, tmp)

            if (hasPermissionAccess && hasRoleAccess) {
                // 如果有子路由，递归处理
                if (tmp.children) {
                    tmp.children = filterAsyncRoutes(tmp.children, userInfo)
                    // 如果子路由被全部过滤掉，且当前路由没有component，则不添加
                    if (tmp.children.length === 0 && !tmp.component && tmp.redirect) {
                        return
                    }
                }
                accessedRoutes.push(tmp)
            }
        })

        return accessedRoutes
    }

    /**
     * 生成路由
     */
    const generateRoutes = (userInfo: UserInfo): Promise<RouteRecordRaw[]> => {
        return new Promise(resolve => {
            let accessedRoutes: RouteRecordRaw[]

            // 超级管理员拥有所有权限
            if (userInfo.roles.includes('superAdmin') || userInfo.permissions.includes('*:*')) {
                accessedRoutes = asyncRoutes || []
            } else {
                // 根据用户权限过滤路由
                accessedRoutes = filterAsyncRoutes(asyncRoutes, userInfo)
            }
            accessedRoutes.push(    {
                path: '/:pathMatch(.*)*',
                name: 'NotFound',
                component: () => import('@/views/NotFound.vue'),
                meta: {
                    title: '页面未找到',
                    hidden: true
                }
            })
            addRoutes.value = accessedRoutes
            routes.value = constantRoutes.concat(accessedRoutes)
            isRoutesGenerated.value = true

            resolve(accessedRoutes)
        })
    }

    /**
     * 重置路由权限
     */
    const resetRoutes = () => {
        routes.value = []
        addRoutes.value = []
        isRoutesGenerated.value = false
    }

    /**
     * 获取用户可访问的菜单
     */
    const getAccessibleMenus = (userInfo: UserInfo): RouteRecordRaw[] => {
        return routes.value
        // return routes.value
        //     .filter(route => {
        //         // 过滤出需要在菜单中显示的路由
        //         return route.meta && !route.meta.hidden && route.children && route.children.length > 0
        //     })
        //     .map(route => {
        //         // 处理子菜单
        //         const children = route.children?.filter(child =>
        //             child.meta && !child.meta.hidden
        //         ) || []
        //
        //         return {
        //             ...route,
        //             children
        //         }
        //     })
    }

    /**
     * 检查用户是否有访问指定路由的权限
     */
    const canAccessRoute = (routePath: string, userInfo: UserInfo): boolean => {
        const findRoute = (routes: RouteRecordRaw[], path: string): RouteRecordRaw | null => {
            for (const route of routes) {
                if (route.path === path) {
                    return route
                }
                if (route.children) {
                    const found = findRoute(route.children, path)
                    if (found) return found
                }
            }
            return null
        }

        const route = findRoute(routes.value, routePath)
        if (!route) {
            console.info(`路由 ${routePath} 不存在`)
            return false
        }

        return hasPermission(userInfo.permissions, route) || hasRole(userInfo.roles, route)
    }

    return {
        // 状态
        routes: readonly(routes),
        addRoutes: readonly(addRoutes),
        isRoutesGenerated: readonly(isRoutesGenerated),

        // 方法
        generateRoutes,
        resetRoutes,
        getAccessibleMenus,
        canAccessRoute,
        hasPermission,
        hasRole
    }
})