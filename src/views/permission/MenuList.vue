<template>
  <div class="menu-management">
    <div class="header">
      <h2>菜单管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增菜单
      </el-button>
    </div>

    <!-- 条件查询表单 -->
    <el-card class="search-card">
      <el-form :model="searchForm" label-width="80px" inline>
        <el-form-item label="菜单名称">
          <el-input
              v-model="searchForm.name"
              placeholder="请输入菜单名称"
              clearable
              @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item label="菜单类型">
          <el-select
              v-model="searchForm.type"
              placeholder="请选择菜单类型"
              clearable
              style="width: 150px"
          >
            <el-option label="目录" :value="1" />
            <el-option label="菜单" :value="2" />
            <el-option label="按钮" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="菜单状态">
          <el-select
              v-model="searchForm.visible"
              placeholder="请选择状态"
              clearable
              style="width: 120px"
          >
            <el-option label="显示" :value="true" />
            <el-option label="隐藏" :value="false" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="menuStore.loading">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 菜单树表格 -->
    <el-table
        :data="menuStore.menuTree"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        v-loading="menuStore.loading"
    >
      <el-table-column prop="name" label="菜单名称" min-width="200">
        <template #default="{ row }">
          <el-icon v-if="row.meta?.icon" style="margin-right: 8px;">
            <component :is="row.meta.icon" />
          </el-icon>
          {{ row.name }}
        </template>
      </el-table-column>

      <el-table-column prop="type" label="类型" width="80">
        <template #default="{ row }">
          <el-tag :type="getTypeTagType(row.type)">
            {{ getTypeText(row.type) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="path" label="路径" min-width="150" />
      <el-table-column prop="component" label="组件" min-width="150" />
      <el-table-column prop="permission" label="权限标识" min-width="120" />
      <el-table-column prop="sort" label="排序" width="80" />

      <el-table-column prop="visible" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.visible ? 'success' : 'danger'">
            {{ row.visible ? '显示' : '隐藏' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="success" @click="handleAddChild(row)">新增子菜单</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 菜单编辑对话框 -->
    <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="600px"
        @close="handleDialogClose"
    >
      <el-form
          :model="formData"
          :rules="formRules"
          ref="formRef"
          label-width="100px"
      >
        <el-form-item label="上级菜单" prop="parentId">
          <el-tree-select
              v-model="formData.parentId"
              :data="parentMenuOptions"
              :props="{ label: 'name', value: 'id', children: 'children' }"
              placeholder="选择上级菜单"
              check-strictly
              clearable
          />
        </el-form-item>

        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio :label="1">目录</el-radio>
            <el-radio :label="2">菜单</el-radio>
            <el-radio :label="3">按钮</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入菜单名称" />
        </el-form-item>

        <el-form-item label="菜单图标" prop="meta.icon" v-if="formData.type !== 3">
          <el-input v-model="formData.meta.icon" placeholder="请输入图标名称" />
        </el-form-item>

        <el-form-item label="路由路径" prop="path" v-if="formData.type !== 3">
          <el-input v-model="formData.path" placeholder="请输入路由路径" />
        </el-form-item>

        <el-form-item label="组件路径" prop="component" v-if="formData.type === 1 || formData.type ===2">
          <el-input v-model="formData.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="重定向路径" prop="redirect" v-if="formData.type === 1 || formData.type ===2">
          <el-input v-model="formData.redirect" placeholder="请输入重定向路径" />
        </el-form-item>

        <el-form-item label="权限标识" prop="permission">
          <el-input v-model="formData.permission" placeholder="请输入权限标识" />
        </el-form-item>

        <el-form-item label="显示排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" />
        </el-form-item>

        <el-form-item label="菜单状态" prop="visible">
          <el-radio-group v-model="formData.visible">
            <el-radio :label="true">显示</el-radio>
            <el-radio :label="false">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="页面标题" prop="meta.title" v-if="formData.type !== 3">
          <el-input v-model="formData.meta.title" placeholder="请输入页面标题" />
        </el-form-item>

        <el-form-item label="需要认证" prop="meta.requiresAuth" v-if="formData.type !== 3">
          <el-switch v-model="formData.meta.requiresAuth" />
        </el-form-item>

        <el-form-item label="缓存页面" prop="meta.keepAlive" v-if="formData.type === 2">
          <el-switch v-model="formData.meta.keepAlive" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import { useMenuStore } from '@/stores/menuStore'
import type { MenuItem } from '@/api/menu'

// Store
const menuStore = useMenuStore()

// 响应式数据
const dialogVisible = ref(false)
const submitting = ref(false)
const formRef = ref()
const editingId = ref<number | null>(null)

// 搜索表单
const searchForm = reactive({
  name: '',
  type: undefined as number | undefined,
  visible: undefined as boolean | undefined
})

// 表单数据
const formData = reactive<Partial<MenuItem>>({
  name: '',
  path: '',
  component: '',
  type: 1,
  visible: true,
  redirect: '',
  sort: 0,
  parentId: undefined,
  permission: '',
  meta: {
    title: '',
    requiresAuth: true,
    hidden: false,
    icon: '',
    keepAlive: false,
    affix: false,
    breadcrumb: true
  }
})

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  path: [
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (formData.type !== 3 && !value) {
          callback(new Error('请输入路由路径'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  component: [
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (formData.type === 2 && !value) {
          callback(new Error('请输入组件路径'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 计算属性
const dialogTitle = computed(() => {
  return editingId.value ? '编辑菜单' : '新增菜单'
})

const parentMenuOptions = computed(() => {
  // 过滤掉按钮类型的菜单作为父级选项
  const filterButtons = (menus: MenuItem[]): MenuItem[] => {
    return menus.filter(menu => menu.type !== 3).map(menu => ({
      ...menu,
      children: menu.children ? filterButtons(menu.children) : []
    }))
  }

  const options = filterButtons(menuStore.menuTree)

  // 如果是编辑模式，需要过滤掉自己和子级菜单
  if (editingId.value) {
    return filterSelfAndChildren(options, editingId.value)
  }

  return options
})

// 方法
const getTypeText = (type: number) => {
  const typeMap = { 1: '目录', 2: '菜单', 3: '按钮' }
  return typeMap[type as keyof typeof typeMap] || '未知'
}

const getTypeTagType = (type: number) => {
  const typeMap = { 1: 'info', 2: 'success', 3: 'warning' }
  return typeMap[type as keyof typeof typeMap] || 'info'
}

const filterSelfAndChildren = (menus: MenuItem[], excludeId: number): MenuItem[] => {
  return menus.filter(menu => {
    if (menu.id === excludeId) return false
    if (menu.children) {
      menu.children = filterSelfAndChildren(menu.children, excludeId)
    }
    return true
  })
}

const resetForm = () => {
  Object.assign(formData, {
    name: '',
    path: '',
    component: '',
    type: 1,
    visible: true,
    sort: 0,
    parentId: undefined,
    permission: '',
    meta: {
      title: '',
      requiresAuth: true,
      hidden: false,
      icon: '',
      keepAlive: false,
      affix: false,
      breadcrumb: true
    }
  })
  editingId.value = null
  formRef.value?.clearValidate()
}

// 处理搜索
const handleSearch = async () => {
  // 构造搜索参数，过滤掉 undefined 值
  const params = Object.fromEntries(
      Object.entries(searchForm).filter(([_, value]) => value !== undefined && value !== '')
  )

  await menuStore.searchMenuTree(params)
}

// 重置搜索条件
const handleReset = async () => {
  searchForm.name = ''
  searchForm.type = undefined
  searchForm.visible = undefined

  // 重置后重新获取完整菜单树
  await menuStore.fetchMenuTree()
}

const handleAdd = () => {
  resetForm()
  dialogVisible.value = true
}

const handleAddChild = (row: MenuItem) => {
  resetForm()
  formData.parentId = row.id
  dialogVisible.value = true
}

const handleEdit = (row: MenuItem) => {
  resetForm()
  editingId.value = row.id

  // 深拷贝数据到表单
  Object.assign(formData, {
    ...row,
    meta: { ...row.meta }
  })

  dialogVisible.value = true
}

const handleDelete = async (row: MenuItem) => {
  try {
    await ElMessageBox.confirm(
        `确定要删除菜单 "${row.name}" 吗？删除后不可恢复！`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
    )

    await menuStore.deleteMenu(row.id)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    submitting.value = true

    if (editingId.value) {
      await menuStore.updateMenu(editingId.value, formData)
      ElMessage.success('更新成功')
    } else {
      await menuStore.createMenu(formData)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitting.value = false
  }
}

const handleDialogClose = () => {
  resetForm()
}

// 生命周期
onMounted(() => {
  menuStore.fetchMenuTree()
})
</script>

<style scoped>
.menu-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  color: #303133;
}

.search-card {
  margin-bottom: 20px;
}

.search-card :deep(.el-card__body) {
  padding: 20px;
}

.search-card .el-form-item {
  margin-bottom: 0;
  margin-right: 20px;
}
</style>
