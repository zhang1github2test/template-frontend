import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePermissionStore } from '@/stores/permission'
import { constantRoutes } from '@/router/routes'
import { ElMessage } from 'element-plus'

const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes,
    scrollBehavior: () => ({ left: 0, top: 0 })
})

// 白名单路由（不需要token验证）
const whiteList = ['/login', '/404']

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const permissionStore = usePermissionStore()

    // 设置页面标题
    if (to.meta?.title) {
        document.title = `${to.meta.title} - Vue3 Template`
    }

    if (authStore.isAuthenticated) {
        // 已登录状态
        if (to.path === '/login') {
            // 已登录用户访问登录页，重定向到首页
            next({ path: '/' })
        } else {
            // 检查是否已生成动态路由
            if (!permissionStore.isRoutesGenerated) {
                try {
                    // 获取用户信息（如果还没有）
                    if (!authStore.userInfo) {
                        await authStore.refreshUserInfo()
                    }

                    if (authStore.userInfo) {
                        // 生成动态路由
                        const accessRoutes = await permissionStore.generateRoutes(authStore.userInfo)
                        // 动态添加路由
                        accessRoutes.forEach(route => {
                            router.addRoute(route)
                        })

                        // 确保addRoute完成后再进行跳转
                        next({ ...to, replace: true })
                    } else {
                        throw new Error('获取用户信息失败')
                    }
                } catch (error) {
                    console.error('生成路由失败:', error)
                    ElMessage.error('获取用户权限失败，请重新登录')
                    // 清除认证信息
                    await authStore.logout()
                    next(`/login?redirect=${to.path}`)
                }
            } else {
                // 已生成路由，检查权限
                if (to.matched.length === 0) {
                    debugger
                    // 路由不存在，可能是没有权限
                    next('/404')
                } else if (authStore.userInfo && !permissionStore.canAccessRoute(to.path, authStore.userInfo)) {
                    // 没有权限访问
                    ElMessage.error('您没有权限访问此页面')
                    next(from.path || '/')
                } else {
                    next()
                }
            }
        }
    } else {
        // 未登录状态
        if (whiteList.includes(to.path)) {
            // 在白名单中，直接进入
            next()
        } else {
            // 不在白名单中，重定向到登录页
            next(`/login?redirect=${to.path}`)
        }
    }
})

// 全局后置钩子
router.afterEach((to) => {
    // 可以在这里添加页面访问日志、埋点等
    console.log(`页面跳转: ${to.path}`)
})

// 路由错误处理
router.onError((error) => {
    console.error('路由错误:', error)
    ElMessage.error('页面加载失败，请刷新重试')
})

export default router