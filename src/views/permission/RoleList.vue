<template>
  <div class="role-list-container">
    <el-card class="role-list-card">
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
        </div>
      </template>

      <!-- 搜索区域 -->
      <el-form
          :model="searchForm"
          :inline="true"
          @submit.prevent="handleSearch"
          class="search-form"
      >
        <el-form-item label="角色名称">
          <el-input
              v-model="searchForm.roleName"
              placeholder="请输入角色名称"
              clearable
              @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item label="角色编码">
          <el-input
              v-model="searchForm.roleCode"
              placeholder="请输入角色编码"
              clearable
              @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select
              v-model="searchForm.status"
              placeholder="请选择状态"
              clearable
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              @click="handleSearch"
              :loading="loading"
          >
            查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <div class="action-bar">
        <el-button
            type="primary"
            icon="Plus"
            @click="handleAdd"
            v-permission="['role:create']"
        >
          新增角色
        </el-button>
        <el-button
            type="danger"
            icon="Delete"
            @click="handleBatchDelete"
            :disabled="selectedRoleIds.length === 0"
            v-permission="['role:delete']"
        >
          批量删除
        </el-button>
      </div>

      <!-- 角色列表 -->
      <el-table
          :data="roleList"
          v-loading="loading"
          border
          stripe
          @selection-change="handleSelectionChange"
          class="role-table"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="roleName" label="角色名称" min-width="120" />
        <el-table-column prop="roleCode" label="角色编码" min-width="120" />
        <el-table-column prop="roleDesc" label="角色描述" min-width="150" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
                type="primary"
                link
                @click="handleEdit(scope.row)"
                v-permission="['role:update']"
            >
              编辑
            </el-button>
            <el-button
                type="danger"
                link
                @click="handleDelete(scope.row)"
                v-permission="['role:delete']"
            >
              删除
            </el-button>
            <el-button
                type="primary"
                link
                @click="handlePermission(scope.row)"
                v-permission="['role:permission']"
            >
              权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          class="pagination"
      />
    </el-card>

    <!-- 角色编辑对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="500px"
        :close-on-click-modal="false"
    >
      <el-form
          ref="roleFormRef"
          :model="roleForm"
          :rules="roleRules"
          label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
              v-model="roleForm.roleName"
              placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input
              v-model="roleForm.roleCode"
              placeholder="请输入角色编码"
              :disabled="isEdit"
          />
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input
              v-model="roleForm.roleDesc"
              type="textarea"
              placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
              v-model="roleForm.status"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
              type="primary"
              @click="handleSubmit"
              :loading="submitLoading"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 权限分配对话框 -->
    <el-dialog
        v-model="permissionDialogVisible"
        title="权限分配"
        width="600px"
        :close-on-click-modal="false"
    >
      <el-tree
          ref="permissionTreeRef"
          :data="permissionTree"
          show-checkbox
          node-key="id"
          :props="{
          children: 'children',
          label: 'name'
        }"
          :default-checked-keys="defaultCheckedPermissions"
          :default-expanded-keys="defaultExpandedPermissions"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button
              type="primary"
              @click="handleSavePermissions"
              :loading="permissionLoading"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoleStore } from '@/stores/role'
import type { Role, Permission } from '@/types/role'

// 类型定义
interface SearchForm {
  roleName: string
  roleCode: string
  status?: number
}

interface Pagination {
  currentPage: number
  pageSize: number
  total: number
}

interface RoleForm {
  roleName: string
  roleCode: string
  roleDesc: string
  status: number
}

// Store
const roleStore = useRoleStore()

// 响应式数据
const loading = ref(false)
const submitLoading = ref(false)
const permissionLoading = ref(false)
const dialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const isEdit = ref(false)
const currentRoleId = ref<number | null>(null)
const selectedRoleIds = ref<number[]>([])
const roleFormRef = ref()
const permissionTreeRef = ref()

// 搜索表单
const searchForm = reactive<SearchForm>({
  roleName: '',
  roleCode: '',
  status: undefined
})

// 分页配置
const pagination = reactive<Pagination>({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 角色表单
const roleForm = reactive<RoleForm>({
  roleName: '',
  roleCode: '',
  roleDesc: '',
  status: 1
})

// 表单验证规则
const roleRules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  roleCode: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
    { pattern: /^[A-Za-z0-9_]+$/, message: '只能包含字母、数字和下划线', trigger: 'blur' }
  ]
}

// 权限相关数据
const permissionTree = ref<Permission[]>([])
const defaultCheckedPermissions = ref<number[]>([])
const defaultExpandedPermissions = ref<number[]>([])

// 计算属性
const dialogTitle = computed(() => {
  return isEdit.value ? '编辑角色' : '新增角色'
})

// 从store获取数据
const roleList = computed(() => roleStore.roles)

// 事件处理
const handleSearch = () => {
  pagination.currentPage = 1
  loadData()
}

const handleReset = () => {
  searchForm.roleName = ''
  searchForm.roleCode = ''
  searchForm.status = undefined
  pagination.currentPage = 1
  loadData()
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(roleForm, {
    roleName: '',
    roleCode: '',
    roleDesc: '',
    status: 1
  })
  dialogVisible.value = true
}

const handleEdit = (row: Role) => {
  isEdit.value = true
  currentRoleId.value = row.id
  Object.assign(roleForm, { ...row })
  dialogVisible.value = true
}

const handleDelete = (row: Role) => {
  ElMessageBox.confirm(
      `确定要删除角色 "${row.roleName}" 吗？`,
      '确认删除',
      {
        type: 'warning'
      }
  ).then(async () => {
    try {
      await roleStore.deleteRole(row.id)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

const handleBatchDelete = () => {
  if (selectedRoleIds.value.length === 0) {
    ElMessage.warning('请先选择要删除的角色')
    return
  }

  ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRoleIds.value.length} 个角色吗？`,
      '确认删除',
      {
        type: 'warning'
      }
  ).then(async () => {
    try {
      await roleStore.batchDeleteRoles(selectedRoleIds.value)
      ElMessage.success('批量删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('批量删除失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

const handlePermission = async (row: Role) => {
  currentRoleId.value = row.id
  permissionDialogVisible.value = true
  permissionLoading.value = true

  try {
    await roleStore.loadPermissionTree()
    permissionTree.value = roleStore.permissionTree
    await roleStore.loadRolePermissions(row.id)
    defaultCheckedPermissions.value = roleStore.rolePermissions.map(item => item.id)
    // 展开所有父节点
    defaultExpandedPermissions.value = getAllParentIds(permissionTree.value, defaultCheckedPermissions.value)
  } catch (error) {
    ElMessage.error('获取权限信息失败')
  } finally {
    permissionLoading.value = false
  }
}

const handleSelectionChange = (selection: Role[]) => {
  selectedRoleIds.value = selection.map(item => item.id)
}

const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  loadData()
}

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  loadData()
}

const handleSubmit = async () => {
  if (!roleFormRef.value) return

  await roleFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    submitLoading.value = true
    try {
      if (isEdit.value && currentRoleId.value) {
        await roleStore.updateRole(currentRoleId.value, roleForm)
        ElMessage.success('更新成功')
      } else {
        await roleStore.createRole(roleForm)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      loadData()
    } catch (error) {
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    } finally {
      submitLoading.value = false
    }
  })
}

const handleSavePermissions = async () => {
  if (!currentRoleId.value) return

  const checkedKeys = permissionTreeRef.value?.getCheckedKeys() || []
  const halfCheckedKeys = permissionTreeRef.value?.getHalfCheckedKeys() || []
  const permissionIds = [...checkedKeys, ...halfCheckedKeys]

  permissionLoading.value = true
  try {
    await roleStore.updateRolePermissions(currentRoleId.value, permissionIds)
    ElMessage.success('权限分配成功')
    permissionDialogVisible.value = false
  } catch (error) {
    ElMessage.error('权限分配失败')
  } finally {
    permissionLoading.value = false
  }
}

// 获取所有父节点ID
const getAllParentIds = (tree: Permission[], checkedIds: number[]): number[] => {
  const parentIds: number[] = []
  const findParents = (nodes: Permission[]) => {
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        if (node.children.some(child => checkedIds.includes(child.id))) {
          parentIds.push(node.id)
        }
        findParents(node.children)
      }
    })
  }
  findParents(tree)
  return parentIds
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    await roleStore.loadRoles({
      ...searchForm,
      page: pagination.currentPage,
      size: pagination.pageSize
    })
    pagination.total = roleStore.total
  } catch (error) {
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

// 监听分页变化
watch([() => pagination.currentPage, () => pagination.pageSize], () => {
  loadData()
})

// 组件挂载时获取数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.role-list-container {
  padding: 20px;
}

.role-list-card {
  margin-bottom: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.search-form {
  margin-bottom: 20px;
}

.action-bar {
  margin-bottom: 20px;
}

.role-table {
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>