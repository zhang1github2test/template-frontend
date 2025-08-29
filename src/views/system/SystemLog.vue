<!-- views/system/SystemLog.vue -->
<template>
  <div class="system-log">
    <el-card class="log-card">
      <template #header>
        <div class="card-header">
          <span>系统日志管理</span>
          <div>
            <el-button
                type="danger"
                @click="handleCleanLogs"
                :disabled="logStore.loading"
            >
              清空日志
            </el-button>
            <el-button
                type="primary"
                @click="handleExportLogs"
                :loading="logStore.submitLoading"
                :disabled="logStore.loading"
            >
              导出日志
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索区域 -->
      <el-form
          :model="logStore.searchForm"
          :inline="true"
          @submit.prevent="handleSearch"
          label-width="80px"
          class="search-form"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="系统模块">
              <el-input
                  v-model="logStore.searchForm.title"
                  placeholder="请输入系统模块"
                  clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="操作人员">
              <el-input
                  v-model="logStore.searchForm.operatorName"
                  placeholder="请输入操作人员"
                  clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="操作类型">
              <el-select
                  v-model="logStore.searchForm.businessType"
                  placeholder="请选择操作类型"
                  clearable
                  style="width: 100%"
              >
                <el-option label="新增" value="ADD" />
                <el-option label="修改" value="UPDATE" />
                <el-option label="删除" value="DELETE" />
                <el-option label="查询" value="SELECT" />
                <el-option label="其他" value="OTHER" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="操作状态">
              <el-select
                  v-model="logStore.searchForm.status"
                  placeholder="请选择操作状态"
                  clearable
                  style="width: 100%"
              >
                <el-option label="正常" :value="0" />
                <el-option label="异常" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="操作时间">
              <el-date-picker
                  v-model="logStore.searchForm.operTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="handleResetSearch">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 日志列表 -->
      <div class="table-toolbar">
        <el-button
            type="danger"
            @click="handleBatchDelete"
            :disabled="logStore.selectedLogIds.length === 0"
        >
          批量删除
        </el-button>
        <div class="selected-info">
          已选择 {{ logStore.selectedLogIds.length }} 项
        </div>
      </div>

      <el-table
          :data="logStore.logList"
          v-loading="logStore.loading"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="系统模块" width="120" show-overflow-tooltip />
        <el-table-column prop="businessType" label="操作类型" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.businessType === 'ADD'">新增</el-tag>
            <el-tag v-else-if="row.businessType === 'UPDATE'" type="warning">修改</el-tag>
            <el-tag v-else-if="row.businessType === 'DELETE'" type="danger">删除</el-tag>
            <el-tag v-else-if="row.businessType === 'SELECT'" type="success">查询</el-tag>
            <el-tag v-else type="info">其他</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="method" label="请求方法" width="200" show-overflow-tooltip />
        <el-table-column prop="operatorName" label="操作人员" width="100" />
        <el-table-column prop="deptName" label="部门名称" width="120" show-overflow-tooltip />
        <el-table-column prop="operIp" label="主机地址" width="130" />
        <el-table-column prop="status" label="操作状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 0" type="success">正常</el-tag>
            <el-tag v-else type="danger">异常</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operTime" label="操作时间" width="180" />
        <el-table-column prop="costTime" label="消耗时间(ms)" width="120">
          <template #default="{ row }">
            <span :class="{ 'time-warning': row.costTime > 1000 }">
              {{ row.costTime }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewLog(row)">详情</el-button>
            <el-popconfirm
                title="确定删除该日志吗？"
                @confirm="handleDeleteLog(row)"
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
          v-model:current-page="logStore.pagination.currentPage"
          v-model:page-size="logStore.pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="logStore.pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          style="margin-top: 20px; text-align: right;"
      />
    </el-card>

    <!-- 日志详情对话框 -->
    <el-dialog
        title="日志详情"
        v-model="detailDialogVisible"
        width="800px"
        @close="handleDetailDialogClose"
    >
      <el-form
          :model="detailForm"
          label-width="120px"
          label-position="left"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="系统模块：">
              <span>{{ detailForm.title }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作类型：">
              <el-tag v-if="detailForm.businessType === 'ADD'">新增</el-tag>
              <el-tag v-else-if="detailForm.businessType === 'UPDATE'" type="warning">修改</el-tag>
              <el-tag v-else-if="detailForm.businessType === 'DELETE'" type="danger">删除</el-tag>
              <el-tag v-else-if="detailForm.businessType === 'SELECT'" type="success">查询</el-tag>
              <el-tag v-else type="info">其他</el-tag>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="操作人员：">
              <span>{{ detailForm.operatorName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称：">
              <span>{{ detailForm.deptName || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主机地址：">
              <span>{{ detailForm.operIp }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作地点：">
              <span>{{ detailForm.operLocation || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <el-tag v-if="detailForm.status === 0" type="success">正常</el-tag>
              <el-tag v-else type="danger">异常</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消耗时间：">
              <span :class="{ 'time-warning': detailForm.costTime > 1000 }">
                {{ detailForm.costTime }} ms
              </span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="请求URL：">
          <span>{{ detailForm.operUrl }}</span>
        </el-form-item>

        <el-form-item label="请求方式：">
          <el-tag>{{ detailForm.requestMethod }}</el-tag>
        </el-form-item>

        <el-form-item label="操作时间：">
          <span>{{ detailForm.operTime }}</span>
        </el-form-item>

        <el-form-item label="请求参数：">
          <el-input
              type="textarea"
              :rows="4"
              v-model="detailForm.operParam"
              readonly
          />
        </el-form-item>

        <el-form-item label="返回结果：">
          <el-input
              type="textarea"
              :rows="4"
              v-model="detailForm.jsonResult"
              readonly
          />
        </el-form-item>

        <el-form-item v-if="detailForm.status === 1" label="异常信息：">
          <el-input
              type="textarea"
              :rows="3"
              v-model="detailForm.errorMsg"
              readonly
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLogStore } from '@/stores/log'
import type { LogItem } from '@/types/log'

// 使用日志store
const logStore = useLogStore()

// 详情对话框状态
const detailDialogVisible = ref(false)

// 详情表单
const detailForm = ref<LogItem>({
  id: 0,
  title: '',
  businessType: '',
  method: '',
  requestMethod: '',
  operatorType: '',
  operatorName: '',
  deptName: '',
  operUrl: '',
  operIp: '',
  operLocation: '',
  operParam: '',
  jsonResult: '',
  status: 0,
  errorMsg: '',
  operTime: '',
  costTime: 0
})

// 搜索
const handleSearch = () => {
  logStore.pagination.currentPage = 1
  logStore.fetchLogList()
}

// 重置搜索
const handleResetSearch = () => {
  logStore.resetSearch()
  logStore.fetchLogList()
}

// 查看日志详情
const handleViewLog = async (row: LogItem) => {
  try {
    const data = await logStore.getLogById(row.id)
    if (data) {
      detailForm.value = data
      detailDialogVisible.value = true
    }
  } catch (error) {
    console.error('获取日志详情失败:', error)
  }
}

// 删除日志
const handleDeleteLog = async (row: LogItem) => {
  await logStore.deleteLog(row.id)
}

// 批量删除
const handleBatchDelete = async () => {
  await logStore.deleteLogs(logStore.selectedLogIds)
}

// 清空日志
const handleCleanLogs = async () => {
  await logStore.cleanLogs()
}

// 导出日志
const handleExportLogs = async () => {
  await logStore.exportLogs()
}

// 选择变化
const handleSelectionChange = (selection: LogItem[]) => {
  logStore.setSelectedLogIds(selection.map(item => item.id))
}

// 关闭详情对话框
const handleDetailDialogClose = () => {
  detailForm.value = {
    id: 0,
    title: '',
    businessType: '',
    method: '',
    requestMethod: '',
    operatorType: '',
    operatorName: '',
    deptName: '',
    operUrl: '',
    operIp: '',
    operLocation: '',
    operParam: '',
    jsonResult: '',
    status: 0,
    errorMsg: '',
    operTime: '',
    costTime: 0
  }
}

// 分页相关
const handleSizeChange = (val: number) => {
  logStore.setPagination(logStore.pagination.currentPage, val)
  logStore.fetchLogList()
}

const handleCurrentChange = (val: number) => {
  logStore.setPagination(val, logStore.pagination.pageSize)
  logStore.fetchLogList()
}

// 组件挂载时获取数据
onMounted(() => {
  logStore.fetchLogList()
})
</script>

<style scoped lang="scss">
.system-log {
  padding: 20px;

  .log-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .search-form {
      margin-bottom: 20px;
      padding: 20px;
      background-color: #f5f7fa;
      border-radius: 4px;
    }

    .table-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .selected-info {
        font-size: 14px;
        color: #606266;
      }
    }
  }

  .time-warning {
    color: #e6a23c;
    font-weight: bold;
  }
}
</style>
