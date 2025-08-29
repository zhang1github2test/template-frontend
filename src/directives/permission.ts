import type { App, DirectiveBinding } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePermissionStore } from '@/stores/permission'

/**
 * 权限指令
 * 用法：
 * v-permission="['user:create']" // 需要有指定权限才显示
 * v-role="['admin']" // 需要有指定角色才显示
 * v-permission:hide="['user:create']" // 没有权限时隐藏而不是移除DOM
 */

// 检查权限
function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
    const { value, arg } = binding
    const authStore = useAuthStore()
    const permissionStore = usePermissionStore()

    if (!authStore.userInfo) {
        // 没有用户信息，隐藏元素
        hideElement(el, arg)
        return
    }

    if (!value || (Array.isArray(value) && value.length === 0)) {
        console.warn('[Directive: permission] 权限值不能为空')
        return
    }

    const permissions = Array.isArray(value) ? value : [value]
    const hasPermission = permissionStore.hasPermission(authStore.userInfo.permissions, {
        meta: { permissions }
    } as any)

    if (!hasPermission) {
        hideElement(el, arg)
    } else {
        showElement(el)
    }
}

// 检查角色
function checkRole(el: HTMLElement, binding: DirectiveBinding) {
    const { value, arg } = binding
    const authStore = useAuthStore()
    const permissionStore = usePermissionStore()

    if (!authStore.userInfo) {
        hideElement(el, arg)
        return
    }

    if (!value || (Array.isArray(value) && value.length === 0)) {
        console.warn('[Directive: role] 角色值不能为空')
        return
    }

    const roles = Array.isArray(value) ? value : [value]
    const hasRole = permissionStore.hasRole(authStore.userInfo.roles, {
        meta: { roles }
    } as any)

    if (!hasRole) {
        hideElement(el, arg)
    } else {
        showElement(el)
    }
}

// 隐藏元素
function hideElement(el: HTMLElement, arg?: string) {
    if (arg === 'hide') {
        // 使用 display: none 隐藏
        el.style.display = 'none'
    } else {
        // 从DOM中移除
        el.parentNode?.removeChild(el)
    }
}

// 显示元素
function showElement(el: HTMLElement) {
    if (el.style.display === 'none') {
        el.style.display = ''
    }
}

// 权限指令
const permission = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        checkPermission(el, binding)
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
        checkPermission(el, binding)
    }
}

// 角色指令
const role = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        checkRole(el, binding)
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
        checkRole(el, binding)
    }
}

// 安装指令
export function setupPermissionDirective(app: App) {
    app.directive('permission', permission)
    app.directive('role', role)
}

export { permission, role }