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
            <el-form-item label="请求路径">
              <el-input
                  v-model="logStore.searchForm.path"
                  placeholder="请输入请求路径"
                  clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="请求方法">
              <el-select
                  v-model="logStore.searchForm.method"
                  placeholder="请选择请求方法"
                  clearable
                  style="width: 120px"
              >
                <el-option label="GET" value="GET" />
                <el-option label="POST" value="POST" />
                <el-option label="PUT" value="PUT" />
                <el-option label="DELETE" value="DELETE" />
                <el-option label="PATCH" value="PATCH" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="处理函数">
              <el-input
                  v-model="logStore.searchForm.handler"
                  placeholder="请输入处理函数"
                  clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="状态码">
              <el-input
                  v-model="logStore.searchForm.status"
                  placeholder="请输入状态码"
                  clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="请求IP">
              <el-input
                  v-model="logStore.searchForm.ip"
                  placeholder="请输入请求IP"
                  clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="时间范围">
              <el-date-picker
                  v-model="logStore.searchForm.timestamp"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
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
        <el-table-column prop="method" label="请求方法" width="100">
          <template #default="{ row }">
            <el-tag
                :type="getMethodTagType(row.method)"
            >
              {{ row.method }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="请求路径" width="200" show-overflow-tooltip />
        <el-table-column prop="handler" label="处理函数" width="150" show-overflow-tooltip />
        <el-table-column prop="ip" label="请求IP" width="130" />
        <el-table-column prop="status" label="状态码" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="latency" label="耗时(ms)" width="120">
          <template #default="{ row }">
            <span :class="{ 'time-warning': row.latency > 1000000000 }">
              {{ formatLatency(row.latency) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="timestamp" label="请求时间" width="180" />
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
            <el-form-item label="请求方法：">
              <el-tag :type="getMethodTagType(detailForm.method)">
                {{ detailForm.method }}
              </el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态码：">
              <el-tag :type="getStatusTagType(detailForm.status)">
                {{ detailForm.status }}
              </el-tag>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="请求路径：">
              <span>{{ detailForm.path }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理函数：">
              <span>{{ detailForm.handler || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="请求IP：">
              <span>{{ detailForm.ip }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户代理：">
              <span>{{ detailForm.userAgent || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="内容长度：">
              <span>{{ detailForm.contentLength }} bytes</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="耗时：">
              <span :class="{ 'time-warning': detailForm.latency > 1000000000 }">
                {{ formatLatency(detailForm.latency) }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="查询参数：">
          <span>{{ detailForm.query || '-' }}</span>
        </el-form-item>

        <el-form-item label="请求时间：">
          <span>{{ detailForm.timestamp }}</span>
        </el-form-item>

        <el-form-item label="请求数据：">
          <el-input
              type="textarea"
              :rows="4"
              :value="formatJson(detailForm.request)"
              readonly
          />
        </el-form-item>

        <el-form-item label="响应数据：">
          <el-input
              type="textarea"
              :rows="4"
              :value="formatJson(detailForm.response)"
              readonly
          />
        </el-form-item>

        <el-form-item v-if="detailForm.errors && detailForm.errors.length > 0" label="错误信息：">
          <el-input
              type="textarea"
              :rows="3"
              :value="detailForm.errors.join('\n')"
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
  timestamp: '',
  method: '',
  path: '',
  query: '',
  ip: '',
  userAgent: '',
  status: 0,
  latency: 0,
  handler: '',
  request: null,
  response: null,
  errors: [],
  contentLength: 0,
  truncated: false,
  createdAt: '',
  updatedAt: ''
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
  await logStore.deleteLogs(logStore.selectedLogIds.value)
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
    timestamp: '',
    method: '',
    path: '',
    query: '',
    ip: '',
    userAgent: '',
    status: 0,
    latency: 0,
    handler: '',
    request: null,
    response: null,
    errors: [],
    contentLength: 0,
    truncated: false,
    createdAt: '',
    updatedAt: ''
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

// 格式化耗时（纳秒转毫秒）
const formatLatency = (latency: number): string => {
  return (latency / 1000000).toFixed(2) // 纳秒转毫秒
}

// 获取方法标签类型
const getMethodTagType = (method: string): '' | 'success' | 'warning' | 'danger' | 'info' => {
  switch (method) {
    case 'GET':
      return 'success'
    case 'POST':
      return 'warning'
    case 'PUT':
      return 'warning'
    case 'DELETE':
      return 'danger'
    case 'PATCH':
      return 'info'
    default:
      return ''
  }
}

// 获取状态码标签类型
const getStatusTagType = (status: number): '' | 'success' | 'warning' | 'danger' | 'info' => {
  if (status >= 200 && status < 300) {
    return 'success'
  } else if (status >= 400 && status < 500) {
    return 'warning'
  } else if (status >= 500) {
    return 'danger'
  } else {
    return 'info'
  }
}

// 格式化JSON数据
const formatJson = (data: any): string => {
  if (data === null || data === undefined) {
    return '-'
  }

  try {
    if (typeof data === 'string') {
      return data
    }
    return JSON.stringify(data, null, 2)
  } catch (e) {
    return String(data)
  }
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