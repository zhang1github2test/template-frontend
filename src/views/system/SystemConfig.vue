<template>
  <div class="system-config">
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>系统配置管理</span>
          <el-button type="primary" @click="handleAddConfig">新增配置</el-button>
        </div>
      </template>

      <!-- 搜索区域 -->
      <el-form :model="systemStore.searchForm" :inline="true" @submit.prevent="systemStore.fetchConfigList">
        <el-form-item label="配置键">
          <el-input v-model="systemStore.searchForm.configKey" placeholder="请输入配置键" />
        </el-form-item>
        <el-form-item label="配置名称">
          <el-input v-model="systemStore.searchForm.configName" placeholder="请输入配置名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="systemStore.fetchConfigList">搜索</el-button>
          <el-button @click="handleResetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 配置列表 -->
      <el-table
          :data="systemStore.configList"
          v-loading="systemStore.loading"
          border
          style="width: 100%">
        <el-table-column prop="configKey" label="配置键" width="200" />
        <el-table-column prop="configName" label="配置名称" width="180" />
        <el-table-column prop="configValue" label="配置值" show-overflow-tooltip />
        <el-table-column prop="configType" label="配置类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.configType === 'Y' ? 'success' : 'info'">
              {{ row.configType === 'Y' ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEditConfig(row)">编辑</el-button>
            <el-button link type="primary" @click="handleViewConfig(row)">查看</el-button>
            <el-popconfirm
                title="确定删除该配置吗？"
                @confirm="handleDeleteConfig(row)"
            >
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
          v-model:current-page="systemStore.pagination.currentPage"
          v-model:page-size="systemStore.pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="systemStore.pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          style="margin-top: 20px; text-align: right;"
      />
    </el-card>

    <!-- 配置编辑对话框 -->
    <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="600px"
        @close="handleDialogClose"
    >
      <el-form
          ref="configFormRef"
          :model="configForm"
          :rules="configFormRules"
          label-width="100px"
      >
        <el-form-item label="配置键" prop="configKey">
          <el-input
              v-model="configForm.configKey"
              placeholder="请输入配置键"
              :disabled="!!configForm.id"
          />
        </el-form-item>

        <el-form-item label="配置名称" prop="configName">
          <el-input v-model="configForm.configName" placeholder="请输入配置名称" />
        </el-form-item>

        <el-form-item label="配置值" prop="configValue">
          <el-input
              v-model="configForm.configValue"
              type="textarea"
              :rows="3"
              placeholder="请输入配置值"
          />
        </el-form-item>

        <el-form-item label="是否系统内置" prop="configType">
          <el-radio-group v-model="configForm.configType">
            <el-radio label="Y">是</el-radio>
            <el-radio label="N">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
              v-model="configForm.remark"
              type="textarea"
              :rows="2"
              placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitConfigForm" :loading="systemStore.submitLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useSystemStore } from '@/stores/system'
import type { ConfigItem } from '@/types/system'

// 使用系统store
const systemStore = useSystemStore()


// 表单引用
const configFormRef = ref<FormInstance>()

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')

// 配置表单
const configForm = reactive({
  id: 0,
  configKey: '',
  configName: '',
  configValue: '',
  configType: 'N',
  remark: '',
  createTime: ''
})

// 表单验证规则
const configFormRules = reactive<FormRules>({
  configKey: [
    { required: true, message: '请输入配置键', trigger: 'blur' },
    { min: 1, max: 100, message: '配置键长度不能超过100个字符', trigger: 'blur' }
  ],
  configName: [
    { required: true, message: '请输入配置名称', trigger: 'blur' },
    { min: 1, max: 100, message: '配置名称长度不能超过100个字符', trigger: 'blur' }
  ],
  configValue: [
    { required: true, message: '请输入配置值', trigger: 'blur' }
  ]
})

// 重置搜索
const handleResetSearch = () => {
  systemStore.resetSearch()
  systemStore.fetchConfigList()
}

// 新增配置
const handleAddConfig = () => {
  dialogTitle.value = '新增配置'
  resetConfigForm()
  dialogVisible.value = true
}

// 编辑配置
const handleEditConfig = (row: ConfigItem) => {
  dialogTitle.value = '编辑配置'
  Object.assign(configForm, row)
  dialogVisible.value = true
}

// 查看配置
const handleViewConfig = (row: ConfigItem) => {
  ElMessageBox.alert(
      `<div>
      <p><strong>配置键：</strong>${row.configKey}</p>
      <p><strong>配置名称：</strong>${row.configName}</p>
      <p><strong>配置值：</strong>${row.configValue}</p>
      <p><strong>配置类型：</strong>${row.configType === 'Y' ? '系统内置' : '自定义'}</p>
      <p><strong>备注：</strong>${row.remark || '无'}</p>
      <p><strong>创建时间：</strong>${row.createTime}</p>
    </div>`,
      '配置详情',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定'
      }
  )
}

// 删除配置
const handleDeleteConfig = async (row: ConfigItem) => {
  await systemStore.deleteConfig(row.id)
}

// 提交配置表单
const submitConfigForm = async () => {
  if (!configFormRef.value) return

  try {
    await configFormRef.value.validate()

    if (configForm.id) {
      // 将响应式对象转换为普通对象
      const formData: ConfigItem = { ...configForm }

      // 编辑
      await systemStore.updateConfig(formData)
    } else {
      // 新增
      await systemStore.addConfig({
        configKey: configForm.configKey,
        configName: configForm.configName,
        configValue: configForm.configValue,
        configType: configForm.configType,
        remark: configForm.remark
      })
    }

    dialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 重置配置表单
const resetConfigForm = () => {
  Object.assign(configForm, {
    id: 0,
    configKey: '',
    configName: '',
    configValue: '',
    configType: 'N',
    remark: ''
  })
}

// 关闭对话框
const handleDialogClose = () => {
  configFormRef.value?.resetFields()
  resetConfigForm()
}

// 分页相关
const handleSizeChange = (val: number) => {
  systemStore.setPagination(systemStore.pagination.currentPage, val)
  systemStore.fetchConfigList()
}

const handleCurrentChange = (val: number) => {
  systemStore.setPagination(val, systemStore.pagination.pageSize)
  systemStore.fetchConfigList()
}

// 组件挂载时获取数据
onMounted(() => {
  systemStore.fetchConfigList()
})
</script>

<style scoped lang="scss">
.system-config {
  padding: 20px;

  .config-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
