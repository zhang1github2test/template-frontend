// utils/permission.ts
/**
 * 权限检查工具类
 */

/**
 * 检查用户是否具有指定权限
 * 支持通配符权限检查，如：
 * - 用户权限 role:view 可以访问 role:view, *:view, role:*, *:*
 * - 用户权限 *:* 可以访问所有权限
 *
 * @param userPermissions 用户拥有的权限列表
 * @param requiredPermission 所需的权限
 * @returns boolean 是否具有权限
 */
export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
    // 如果用户没有权限或所需权限为空，则无权限
    if (!userPermissions || userPermissions.length === 0 || !requiredPermission) {
        return false
    }

    // 如果用户拥有超级权限 *:*，则具有所有权限
    if (userPermissions.includes('*:*')) {
        return true
    }

    // 如果所需权限是超级权限，则只有用户也拥有超级权限才能访问
    if (requiredPermission === '*:*') {
        return userPermissions.includes('*:*')
    }

    // 解析所需权限
    const [requiredResource, requiredAction] = requiredPermission.split(':')

    // 遍历用户权限进行匹配
    for (const userPermission of userPermissions) {
        // 如果用户权限是超级权限，直接返回true
        if (userPermission === '*:*') {
            return true
        }

        const [userResource, userAction] = userPermission.split(':')

        // 如果用户权限格式不正确，跳过
        if (!userResource || !userAction) {
            continue
        }

        // 精确匹配
        if (userPermission === requiredPermission) {
            return true
        }

        // 资源通配符匹配 (*:action)
        if (userResource === '*' && userAction === requiredAction) {
            return true
        }

        // 操作通配符匹配 (resource:*)
        if (userResource === requiredResource && userAction === '*') {
            return true
        }

        // 双通配符匹配 (*:*)
        if (userResource === '*' && userAction === '*') {
            return true
        }
    }

    return false
}

/**
 * 检查用户是否具有多个权限中的任意一个
 *
 * @param userPermissions 用户拥有的权限列表
 * @param requiredPermissions 所需的权限列表
 * @param matchMode 匹配模式 'any' 表示任意一个匹配即可，'all' 表示所有都必须匹配
 * @returns boolean 是否具有权限
 */
export function hasAnyPermission(
    userPermissions: string[],
    requiredPermissions: string[],
    matchMode: 'any' | 'all' = 'any'
): boolean {
    if (!requiredPermissions || requiredPermissions.length === 0) {
        return true
    }

    if (matchMode === 'all') {
        return requiredPermissions.every(permission =>
            hasPermission(userPermissions, permission)
        )
    } else {
        return requiredPermissions.some(permission =>
            hasPermission(userPermissions, permission)
        )
    }
}

/**
 * 检查用户是否具有指定角色
 *
 * @param userRoles 用户拥有的角色列表
 * @param requiredRoles 所需的角色列表
 * @returns boolean 是否具有角色
 */
export function hasRole(userRoles: string[], requiredRoles: string[]): boolean {
    if (!userRoles || userRoles.length === 0 || !requiredRoles || requiredRoles.length === 0) {
        return false
    }

    return requiredRoles.some(role => userRoles.includes(role))
}

/**
 * 检查路由权限
 *
 * @param route 路由配置
 * @param userInfo 用户信息（包含权限和角色）
 * @returns boolean 是否具有访问权限
 */
export function checkRoutePermission(route: any, userInfo: any): boolean {
    // 如果路由没有设置权限要求，则允许访问
    if (!route.meta?.permissions && !route.meta?.roles) {
        return true
    }

    // 检查权限
    if (route.meta?.permissions && route.meta.permissions.length > 0) {
        const hasPerm = hasAnyPermission(userInfo.permissions || [], route.meta.permissions)
        if (!hasPerm) {
            return false
        }
    }

    // 检查角色
    if (route.meta?.roles && route.meta.roles.length > 0) {
        const hasRolePerm = hasRole(userInfo.roles || [], route.meta.roles)
        if (!hasRolePerm) {
            return false
        }
    }

    return true
}
