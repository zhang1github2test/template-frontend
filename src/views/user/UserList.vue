<template>
  <div class="user-list">
    <div class="page-header">
      <h1>用户管理</h1>
      <p>管理系统用户信息</p>
    </div>

    <!-- 操作栏 -->
    <el-card class="operation-card">
      <div class="operation-bar">
        <div class="operation-left">
          <el-button
              v-if="hasPermission(['user:create'])"
              type="primary"
              :icon="IconEpPlus"
              @click="handleCreate"
          >
            新增用户
          </el-button>
          <el-button
              v-if="hasPermission(['user:export'])"
              type="success"
              :icon="IconEpDownload"
              @click="handleExport"
          >
            导出数据
          </el-button>
        </div>

        <div class="operation-right">
          <el-input
              v-model="searchForm.keyword"
              placeholder="请输入用户名或邮箱"
              style="width: 250px;"
              clearable
              @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button :icon="IconEpSearch" @click="handleSearch" />
            </template>
          </el-input>
        </div>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table
          v-loading="userStore.loading"
          :data="userStore.userList"
          row-key="id"
          height="400"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />

        <el-table-column label="角色" width="150">
          <template #default="{ row }">
            <el-tag
                v-for="role in row.roles"
                :key="role.id"
                type="primary"
                size="small"
                style="margin-right: 4px;"
            >
              {{ role.roleName }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
                v-if="hasPermission(['user:edit'])"
                type="primary"
                size="small"
                link
                @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
                v-if="hasPermission(['user:delete'])"
                type="danger"
                size="small"
                link
                @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.size"
            :total="pagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { usePermissionStore } from '@/stores/permission'
import { Search as IconEpSearch,Plus as IconEpPlus, Download as IconEpDownload} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'

const permissionStore = usePermissionStore()
const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

// 搜索表单
const searchForm = reactive({
  keyword: ''
})

// 分页信息
const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})


const loading = ref(false)

// 权限检查
const hasPermission = (permissions: string[]) => {
  if (authStore.userInfo) {
    return permissionStore.hasPermission(authStore.userInfo.permissions, { meta: { permissions } } as any)
        || permissionStore.hasRole(authStore.userInfo.roles, { meta: { permissions }  } as any)
  }
  return false
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  userStore.updateQueryParams({
    page: pagination.page,
    pageSize: pagination.size,
    username: searchForm.keyword,
    nickname: searchForm.keyword,
    email: searchForm.keyword
  })
  loadData()
}

// 新增用户
const handleCreate = () => {
  router.push('/user/create')
}

// 编辑用户
const handleEdit = (row: any) => {
  router.push(`/user/edit/${row.id}`)
}

// 删除用户
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除用户 "${row.username}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.deleteUser(row.id)
    // 执行删除操作
    ElMessage.success('删除成功')
    loadData()
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 导出数据
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

// 页面大小改变
const handleSizeChange = (val: number) => {
  pagination.size = val
  loadData()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
  pagination.page = val
  loadData()
}

// 加载数据
const loadData = async () => {
  await userStore.fetchUsers()
  pagination.total = userStore.total
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.user-list {
  .page-header {
    margin-bottom: 24px;

    h1 {
      font-size: 24px;
      color: #2c3e50;
      margin: 0 0 8px 0;
    }

    p {
      color: #7f8c8d;
      margin: 0;
      font-size: 14px;
    }
  }

  .operation-card {
    margin-bottom: 16px;

    .operation-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .operation-left {
        display: flex;
        gap: 12px;
      }

      .operation-right {
        display: flex;
        gap: 12px;
        align-items: center;
      }
    }
  }

  .table-card {
    .pagination-wrapper {
      margin-top: 16px;
      display: flex;
      justify-content: center;
    }
  }
}

@media (max-width: 768px) {
  .user-list {
    .operation-bar {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;

      .operation-left,
      .operation-right {
        justify-content: center;
      }
    }
  }
}
</style>