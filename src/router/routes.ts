import type { RouteRecordRaw } from 'vue-router'

// 扩展路由元信息类型
declare module 'vue-router' {
    interface RouteMeta {
        title?: string
        requiresAuth?: boolean
        hidden?: boolean
        icon?: string
        permissions?: string[]
        roles?: string[]
        keepAlive?: boolean
        affix?: boolean
        breadcrumb?: boolean
        activeMenu?: string
    }
}

/**
 * 基础路由（不需要权限）
 * 所有用户都可以访问
 */
export const constantRoutes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        meta: {
            requiresAuth: false,
            title: '登录',
            hidden: true
        }
    }

]

/**
 * 动态路由（需要权限）
 * 根据用户权限动态加载
 */
export const asyncRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Layout',
        component: () => import('@/layout/index.vue'),
        redirect: '/dashboard',
        meta: {
            requiresAuth: true,
            title: '首页',
            permissions: ['Layout:view'],
        },
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('@/views/Dashboard.vue'),
                meta: {
                    requiresAuth: true,
                    permissions: ['Dashboard:view'],
                    title: '仪表盘',
                    icon: 'ep:data-board',
                    affix: true // 固定在标签页
                }
            }
        ]
    },
    // 用户管理模块
    {
        path: '/user',
        name: 'User',
        component: () => import('@/layout/index.vue'),
        redirect: '/user/list',
        meta: {
            title: '用户管理',
            icon: 'ep:user',
            permissions: ['user:home'],
            roles: ['admin', 'superAdmin'],
            requiresAuth: true,
        },
        children: [
            {
                path: '/user/list',
                name: 'userList',
                component: () => import('@/views/user/UserList.vue'),
                meta: {
                    title: '用户列表',
                    permissions: ['user:view'],
                    keepAlive: true,
                    requiresAuth: true,
                }
            },
            {
                path: '/user/create',
                name: 'UserCreate',
                component: () => import('@/views/user/UserForm.vue'),
                meta: {
                    title: '新增用户',
                    permissions: ['user:create'],
                    hidden: true,
                    activeMenu: '/user/list',
                    requiresAuth: true,
                }
            },
            {
                path: '/user/edit/:id',
                name: 'UserEdit',
                component: () => import('@/views/user/UserForm.vue'),
                meta: {
                    title: '编辑用户',
                    permissions: ['user:edit'],
                    hidden: true,
                    activeMenu: '/user/list',
                    requiresAuth: true,
                }
            }
        ]
    },

    // 权限管理模块
    {
        path: '/permission',
        name: 'Permission',
        component: () => import('@/layout/index.vue'),
        redirect: '/permission/role',
        meta: {
            title: '权限管理',
            icon: 'ep:lock',
            roles: ['admin', 'superAdmin'],
            requiresAuth: true,
        },
        children: [
            {
                path: '/permission/role',
                name: 'RoleManagement',
                component: () => import('@/views/permission/RoleList.vue'),
                meta: {
                    title: '角色管理',
                    permissions: ['role:view'],
                    requiresAuth: true,
                }
            },
            {
                path: '/permission/menu',
                name: 'MenuManagement',
                component: () => import('@/views/permission/MenuList.vue'),
                meta: {
                    title: '菜单管理',
                    permissions: ['menu:view'],
                    roles: ['superAdmin'],
                    requiresAuth: true,
                }
            },
            {
                path: '/permission/resources',
                name: 'ResourceManagement',
                component: () => import('@/views/permission/ResourceManagement.vue'),
                meta: {
                    title: '资源管理',
                    icon: 'Lock',
                    permissions: ['resource:view'],
                    requiresAuth: true,
                }
            }
        ]
    },

    // 系统管理模块
    {
        path: '/system',
        name: 'System',
        component: () => import('@/layout/index.vue'),
        redirect: '/system/config',
        meta: {
            title: '系统管理',
            icon: 'ep:setting',
            roles: ['admin', 'superAdmin'],
            requiresAuth: true,
        },
        children: [
            {
                path: '/system/config',
                name: 'SystemConfig',
                component: () => import('@/views/system/SystemConfig.vue'),
                meta: {
                    title: '系统配置',
                    permissions: ['system:config'],
                    requiresAuth: true,
                }
            },
            {
                path: '/system/log',
                name: 'SystemLog',
                component: () => import('@/views/system/SystemLog.vue'),
                meta: {
                    title: '系统日志',
                    permissions: ['system:log'],
                    roles: ['superAdmin'],
                    requiresAuth: true,
                }
            }
        ]
    },

    {
        path: '/junior',
        name: 'JuniorExamMgmt',
        component: () => import('@/layout/index.vue'),
        redirect: '/junior/schoolAdmission',
        meta: {
            title: '中考管理',
            hidden: false,
            icon: 'ep:school',
            permissions: ['schoolAdmission:view'],
            requiresAuth: true,
        },
        children: [
            {
                path: '/junior/schoolAdmission',
                name: 'SchoolAdmission',
                component: () => import('@/views/edu/SchoolAdmission.vue'),
                meta: {
                    title: '中考录取线',
                    hidden: false,
                    icon: 'ep:school',
                    permissions: ['schoolAdmission:view'],
                    requiresAuth: true,
                }
            },
            {
                path: '/junior/admissionPlan',
                name: 'AdmissionPlan',
                component: () => import('@/views/AdmissionPlan/index.vue'),
                meta: {
                    title: '中考招生计划',
                    hidden: false,
                    icon: 'ep:school',
                    permissions: ['admissionPlan:view'],
                    requiresAuth: true,
                }
            }
        ]
    },

    // 个人中心（所有登录用户都可访问）
    {
        path: '/profile',
        name: 'ProfileLayout',
        component: () => import('@/layout/index.vue'),
        redirect: '/profile/index',
        meta: {
            title: '个人中心',
            icon: 'ep:user',
            hidden: true, // 在侧边栏隐藏，通过头部用户菜单访问
            requiresAuth: true,
        },
        children: [
            {
                path: '/profile/index',
                name: 'Profile',
                component: () => import('@/views/Profile.vue'),
                meta: {
                    title: '个人信息',
                    breadcrumb: false,
                    requiresAuth: true,
                }
            }
        ]
    }
]

/**
 * 所有路由（用于类型推导）
 */
export const allRoutes = [...constantRoutes, ...asyncRoutes]