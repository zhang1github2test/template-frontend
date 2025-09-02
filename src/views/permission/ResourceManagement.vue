<template>
  <div class="resource-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>资源管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增资源
          </el-button>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="资源名称">
          <el-input
              v-model="searchForm.resource_name"
              placeholder="请输入资源名称"
              clearable
          />
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input
              v-model="searchForm.permission_code"
              placeholder="请输入权限标识"
              clearable
          />
        </el-form-item>
        <el-form-item label="资源类型">
          <el-select
              v-model="searchForm.type"
              placeholder="请选择资源类型"
              clearable
          >
            <el-option
                v-for="item in RESOURCE_TYPES"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
              v-model="searchForm.status"
              placeholder="请选择状态"
              clearable
          >
            <el-option
                v-for="item in STATUS_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <el-table
          v-loading="resourceStore.loading"
          :data="resourceStore.resources"
          :tree-props="{ children: 'children', hasChildren: 'has_children' }"
          :load="loadChildren"
          row-key="id"
          lazy
          border
          style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="resource_name" label="资源名称" min-width="120" />
        <el-table-column prop="permission_code" label="权限标识" min-width="150" />
        <el-table-column prop="type" label="资源类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="resource_path" label="资源路径" min-width="200" />
        <el-table-column prop="http_method" label="HTTP方法" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.http_method" :type="getMethodTagType(row.http_method)">
              {{ row.http_method }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="requires_auth" label="需要鉴权" width="100">
          <template #default="{ row }">
            <el-tag :type="row.requires_auth === 1 ? 'warning' : 'info'">
              {{ row.requires_auth === 1 ? '需要' : '不需要' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
<!--      <div class="pagination-container">-->
<!--        <el-pagination-->
<!--            v-model:current-page="pagination.page"-->
<!--            v-model:page-size="pagination.pageSize"-->
<!--            :page-sizes="[10, 20, 50, 100]"-->
<!--            :total="resourceStore.total"-->
<!--            layout="total, sizes, prev, pager, next, jumper"-->
<!--            @size-change="handleSizeChange"-->
<!--            @current-change="handleCurrentChange"-->
<!--        />-->
<!--      </div>-->
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="600px"
        @close="handleDialogClose"
    >
      <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="资源名称" prop="resource_name">
              <el-input v-model="formData.resource_name" placeholder="请输入资源名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限标识" prop="permission_code">
              <el-input v-model="formData.permission_code" placeholder="请输入权限标识" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="资源类型" prop="type">
              <el-select
                  v-model="formData.type"
                  placeholder="请选择资源类型"
                  style="width: 100%"
                  @change="handleTypeChange"
              >
                <el-option
                    v-for="item in RESOURCE_TYPES"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父级资源">
              <el-select
                  v-model="formData.parent_id"
                  placeholder="请选择父级资源"
                  style="width: 100%"
                  clearable
              >
                <el-option
                    v-for="item in resourceStore.resourceOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="资源路径">
          <el-input v-model="formData.resource_path" placeholder="请输入资源路径" />
        </el-form-item>

        <el-row :gutter="20" v-if="formData.type === 'API'">
          <el-col :span="12">
            <el-form-item label="HTTP方法">
              <el-select
                  v-model="formData.http_method"
                  placeholder="请选择HTTP方法"
                  style="width: 100%"
              >
                <el-option
                    v-for="item in HTTP_METHODS"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="需要鉴权">
              <el-select
                  v-model="formData.requires_auth"
                  placeholder="请选择"
                  style="width: 100%"
              >
                <el-option
                    v-for="item in AUTH_OPTIONS"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number
                  v-model="formData.sort"
                  :min="0"
                  style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="isEdit">
            <el-form-item label="状态">
              <el-select
                  v-model="formData.status"
                  placeholder="请选择状态"
                  style="width: 100%"
              >
                <el-option
                    v-for="item in STATUS_OPTIONS"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="描述">
          <el-input
              v-model="formData.desc"
              type="textarea"
              :rows="3"
              placeholder="请输入描述"
          />
        </el-form-item>

        <el-form-item label="备注">
          <el-input
              v-model="formData.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="resourceStore.loading">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import { useResourceStore } from '@/stores/resource'
import type { Resource, CreateResourceRequest, UpdateResourceRequest } from '@/types/resource'
import {
  RESOURCE_TYPES,
  HTTP_METHODS,
  STATUS_OPTIONS,
  AUTH_OPTIONS
} from '@/types/resource'

// Store
const resourceStore = useResourceStore()

// 搜索表单
const searchForm = reactive({
  resource_name: '',
  permission_code: '',
  type: '',
  status: undefined as number | undefined
})


// 对话框
const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref<number>()
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<CreateResourceRequest & { status?: number }>({
  resource_name: '',
  permission_code: '',
  desc: '',
  type: '',
  resource_path: '',
  http_method: '',
  parent_id: undefined,
  sort: 0,
  requires_auth: 1,
  remark: '',
  status: 1
})

// 表单验证规则
const formRules: FormRules = {
  resource_name: [
    { required: true, message: '请输入资源名称', trigger: 'blur' },
    { max: 50, message: '资源名称不能超过50个字符', trigger: 'blur' }
  ],
  permission_code: [
    { required: true, message: '请输入权限标识', trigger: 'blur' },
    { max: 100, message: '权限标识不能超过100个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择资源类型', trigger: 'change' }
  ]
}

// 计算属性
const dialogTitle = computed(() => isEdit.value ? '编辑资源' : '新增资源')

// 方法
const loadData = async () => {
  const params = {
    ...searchForm,
  }
  await resourceStore.fetchResources(params)
}

const handleSearch = () => {
  loadData()
}

const handleReset = () => {
  Object.assign(searchForm, {
    resource_name: '',
    permission_code: '',
    type: '',
    status: undefined
  })
  loadData()
}



const handleAdd = () => {
  isEdit.value = false
  dialogVisible.value = true
  resetForm()
}

const handleEdit = (row: Resource) => {
  isEdit.value = true
  editId.value = row.id
  dialogVisible.value = true
  Object.assign(formData, row)
}

// 加载子资源
const loadChildren = (row: Resource, treeNode: any, resolve: any) => {
  resourceStore.loadResources({ parent_id: row.id }).then(res => {
    resolve(res)
  })
}

const handleDelete = async (row: Resource) => {
  try {
    await ElMessageBox.confirm(`确定要删除资源"${row.resource_name}"吗？`, '确认删除', {
      type: 'warning'
    })

    const success = await resourceStore.deleteResource(row.id)
    if (success) {
      loadData()
    }
  } catch (error) {
    // 用户取消删除
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    let success = false
    if (isEdit.value && editId.value) {
      const { status, ...updateData } = formData
      const updatePayload: UpdateResourceRequest = { ...updateData, status }
      success = await resourceStore.updateResource(editId.value, updatePayload)
    } else {
      const { status, ...createData } = formData
      success = await resourceStore.createResource(createData)
    }

    if (success) {
      dialogVisible.value = false
      loadData()
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
  resetForm()
}

const handleTypeChange = (type: string) => {
  if (type !== 'API') {
    formData.http_method = ''
  }
}

const resetForm = () => {
  Object.assign(formData, {
    resource_name: '',
    permission_code: '',
    desc: '',
    type: '',
    resource_path: '',
    http_method: '',
    parent_id: undefined,
    sort: 0,
    requires_auth: 1,
    remark: '',
    status: 1
  })
}

// 工具函数
const getTypeLabel = (type: string) => {
  return RESOURCE_TYPES.find(item => item.value === type)?.label || type
}

const getTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    'MENU': 'primary',
    'BUTTON': 'success',
    'API': 'warning'
  }
  return typeMap[type] || 'info'
}

const getMethodTagType = (method: string) => {
  const methodMap: Record<string, string> = {
    'GET': 'success',
    'POST': 'primary',
    'PUT': 'warning',
    'DELETE': 'danger'
  }
  return methodMap[method] || 'info'
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('zh-CN')
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.resource-management {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .search-form {
    margin-bottom: 20px;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>