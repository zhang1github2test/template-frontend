<!-- layout/index.vue -->
<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <el-icon class="logo-icon">
            <Grid />
          </el-icon>
          <span v-if="!isCollapsed" class="logo-text">Admin</span>
        </div>
      </div>

      <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          :collapse="isCollapsed"
          :collapse-transition="false"
          router
      >
        <template v-for="route in menuRoutes" :key="route.path">
          <sidebar-item :route="route" :base-path="route.path" />
        </template>
      </el-menu>
    </div>

    <!-- 主内容区域 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <div class="navbar">
        <div class="navbar-left">
          <el-button
              type="text"
              class="collapse-btn"
              @click="toggleCollapse"
          >
            <el-icon>
              <Expand v-if="isCollapsed" />
              <Fold v-else />
            </el-icon>
          </el-button>

          <el-breadcrumb separator="/">
            <el-breadcrumb-item
                v-for="item in breadcrumbs"
                :key="item.path"
                :to="item.path"
            >
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="navbar-right">
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="authStore.userInfo?.avatar">
                {{ authStore.userInfo?.nickname?.charAt(0) || 'U' }}
              </el-avatar>
              <span class="username">{{ authStore.userInfo?.nickname || '用户' }}</span>
              <el-icon class="arrow-icon">
                <ArrowDown />
              </el-icon>
            </div>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 页面内容 -->
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePermissionStore } from '@/stores/permission'
import { ElMessage } from 'element-plus'
import {
  Grid,
  Expand,
  Fold,
  ArrowDown,
  User,
  Setting,
  SwitchButton
} from '@element-plus/icons-vue'
import SidebarItem from '@/components/SidebarItem.vue'

const authStore = useAuthStore()
const permissionStore = usePermissionStore()
const route = useRoute()
const router = useRouter()

// 侧边栏折叠状态
const isCollapsed = ref(false)

// 当前激活的菜单
const activeMenu = computed(() => {
  return (route.meta?.activeMenu as string) || route.path
})

// 获取菜单路由
const menuRoutes = computed(() => {
  if (authStore.userInfo) {
    return permissionStore.getAccessibleMenus(authStore.userInfo)
  }
  return []
})

// 面包屑导航
const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta?.title && item.meta?.breadcrumb !== false)
  return matched.map(item => ({
    title: item.meta?.title as string,
    path: item.path
  }))
})

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile/index')
      break
    case 'settings':
      // 处理设置
      ElMessage.info('设置功能开发中...')
      break
    case 'logout':
      authStore.logout()
      break
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  width: 100%;
  height: 100vh;
}

.sidebar {
  width: 240px;
  background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
  border-right: 1px solid #e4e7ed;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  transition: width 0.3s ease;
  flex-shrink: 0;

  &.collapsed {
    width: 64px;
  }

  .sidebar-header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #e4e7ed;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, #409eff, transparent);
    }

    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: 600;
      color: #ffffff;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

      .logo-icon {
        font-size: 28px;
        margin-right: 8px;
        color: #ffffff;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
      }

      .logo-text {
        transition: opacity 0.3s ease;
        letter-spacing: 1px;
      }
    }
  }

  .sidebar-menu {
    border: none;
    height: calc(100vh - 60px);
    overflow-y: auto;
    background: transparent;

    /* 自定义滚动条 */
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #c0c4cc;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #909399;
    }

    :deep(.el-menu-item) {
      height: 48px;
      line-height: 48px;
      margin: 2px 8px;
      border-radius: 6px;
      transition: all 0.3s ease;

      &:hover {
        background-color: #f0f9ff;
        color: #409eff;
        transform: translateX(2px);
      }

      &.is-active {
        background: linear-gradient(135deg, #409eff 0%, #79bbff 100%);
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
        font-weight: 500;

        &::after {
          display: none; // 移除原有的右边框指示器
        }
      }
    }

    :deep(.el-sub-menu) {
      margin: 2px 8px;
      border-radius: 6px;
      overflow: hidden;

      .el-sub-menu__title {
        height: 48px;
        line-height: 48px;
        border-radius: 6px;
        transition: all 0.3s ease;

        &:hover {
          background-color: #f0f9ff;
          color: #409eff;
          transform: translateX(2px);
        }
      }
    }
  }
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.navbar {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #ffffff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;

  .navbar-left {
    display: flex;
    align-items: center;

    .collapse-btn {
      font-size: 18px;
      margin-right: 16px;
      padding: 8px;
      border-radius: 6px;
      transition: all 0.3s ease;

      &:hover {
        background-color: #f5f7fa;
        color: #409eff;
      }
    }
  }

  .navbar-right {
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 6px;
      transition: all 0.3s ease;

      &:hover {
        background-color: #f5f7fa;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .username {
        margin: 0 8px;
        font-size: 14px;
        color: #606266;
        font-weight: 500;
      }

      .arrow-icon {
        font-size: 12px;
        color: #909399;
        transition: transform 0.3s ease;
      }

      &:hover .arrow-icon {
        transform: rotate(180deg);
      }
    }
  }
}

.page-content {
  flex: 1;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: auto;

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #909399;
  }
}
</style>