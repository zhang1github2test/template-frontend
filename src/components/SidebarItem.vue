<!-- components/SidebarItem.vue -->
<template>
  <div v-if="!route.meta?.hidden">
    <!-- 如果有子路由，则显示为子菜单 -->
    <el-sub-menu
        v-if="hasVisibleChildren"
        :index="resolvePath(route.path)"
        teleported
    >
      <template #title>
        <el-icon v-if="getIconComponent(route.meta?.icon)">
          <component :is="getIconComponent(route.meta?.icon)" />
        </el-icon>
        <span>{{ route.meta?.title }}</span>
<!--        <span>{{ route.name }}</span>-->
      </template>

      <sidebar-item
          v-for="child in route.children"
          :key="child.path"
          :is-nest="true"
          :route="child"
          :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>

    <!-- 如果没有子路由，则直接显示为菜单项 -->
    <app-link v-else :to="resolvePath(route.path)">
      <el-menu-item :index="resolvePath(route.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
        <el-icon v-if="getIconComponent(route.meta?.icon)">
          <component :is="getIconComponent(route.meta?.icon)" />
        </el-icon>
        <template #title>
          <span>{{ route.meta?.title }}</span>
        </template>
      </el-menu-item>
    </app-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { isExternal } from '@/utils/validate'
import { getIcon } from '@/utils/icon'
import AppLink from '@/components/AppLink.vue'

interface Props {
  route: RouteRecordRaw
  isNest?: boolean
  basePath: string
}

const props = withDefaults(defineProps<Props>(), {
  isNest: false,
  basePath: ''
})

// 计算是否有可见的子路由
const hasVisibleChildren = computed(() => {
  return props.route.children && props.route.children.some(child => !child.meta?.hidden)
})

/**
 * 解析路径
 */
const resolvePath = (routePath: string): string => {
  // 如果是外部链接，直接返回
  if (isExternal(routePath)) {
    return routePath
  }

  // 如果basePath是外部链接，直接返回
  if (isExternal(props.basePath)) {
    return props.basePath
  }

  // 处理路径拼接
  const fullPath = pathResolve(props.basePath, routePath)
  return fullPath
}

/**
 * 路径解析工具
 */
const pathResolve = (basePath: string, relativePath: string): string => {
  // 如果relativePath是绝对路径
  if (relativePath.startsWith('/')) {
    // 移除末尾斜杠（除非是根路径）
    return relativePath === '/' ? '/' : relativePath.replace(/\/$/, '')
  }

  // 处理相对路径
  let resultPath = ''

  // 确保basePath末尾没有斜杠（除非是根路径）
  const cleanBasePath = basePath === '/' ? '' : basePath.replace(/\/$/, '')

  // 确保relativePath开头没有斜杠
  const cleanRelativePath = relativePath.replace(/^\//, '')

  // 拼接路径
  if (cleanBasePath === '') {
    resultPath = '/' + cleanRelativePath
  } else {
    resultPath = cleanBasePath + '/' + cleanRelativePath
  }

  // 特殊处理：确保不是以 / 结尾（除非是根路径）
  if (resultPath !== '/' && resultPath.endsWith('/')) {
    resultPath = resultPath.slice(0, -1)
  }

  return resultPath
}

/**
 * 获取图标组件
 */
const getIconComponent = (icon?: string) => {
  return getIcon(icon)
}
</script>

<style lang="scss" scoped>
.submenu-title-noDropdown {
  padding: 0 !important;

  :deep(.el-tooltip) {
    padding: 0 20px !important;
  }
}

:deep(.el-sub-menu) {
  .el-sub-menu__title {
    position: relative;

    //&:hover {
    //  background-color: #f0f9ff !important;
    //  color: #409eff;
    //}

    // 给父级菜单添加背景色
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(to bottom, #409eff, #79bbff);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover:before {
      opacity: 1;
    }
  }

  .el-menu {
    background-color: #fafbfc;

    .el-sub-menu__title,
    .el-menu-item {
      min-width: 0 !important;
      height: 45px !important;
      line-height: 45px !important;
      background-color: transparent;
      position: relative;

      //&:hover {
      //  background-color: #f0f9ff !important;
      //  color: #409eff;
      //}

      &.is-active {
        background-color: transparent !important;
        font-weight: 500;

        &:after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid #409eff;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
        }
      }
    }
  }
}

/* 修正缩进层级 - 父级菜单在左，子级菜单递增缩进 */
:deep(.el-menu-item) {
  padding-left: 20px !important; // 顶级菜单项
}

:deep(.el-sub-menu .el-sub-menu__title) {
  padding-left: 20px !important; // 顶级子菜单标题
}

/* 第一级子菜单（父级菜单的子菜单）*/
:deep(.el-sub-menu .el-menu .el-sub-menu__title),
:deep(.el-sub-menu .el-menu .el-menu-item) {
  padding-left: 45px !important; // 子菜单更靠右
}

/* 第二级子菜单 */
:deep(.el-sub-menu .el-menu .el-sub-menu .el-sub-menu__title),
:deep(.el-sub-menu .el-menu .el-sub-menu .el-menu-item) {
  padding-left: 65px !important; // 更深层级的子菜单
}

/* 第三级子菜单 */
:deep(.el-sub-menu .el-menu .el-sub-menu .el-sub-menu .el-sub-menu__title),
:deep(.el-sub-menu .el-menu .el-sub-menu .el-sub-menu .el-menu-item) {
  padding-left: 85px !important;
}

/* 添加子菜单的连接线效果 */
:deep(.el-sub-menu .el-menu) {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 32px;
    top: 0;
    bottom: 0;
    width: 1px;
    background-color: #e4e7ed;
  }
}

/* 子菜单项的圆点指示器 */
:deep(.el-sub-menu .el-menu .el-menu-item) {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 37px;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #c0c4cc;
    transition: all 0.3s ease;
  }

  &:hover::before,
  &.is-active::before {
    background-color: #409eff;
    transform: translateY(-50%) scale(1.2);
  }
}
</style>