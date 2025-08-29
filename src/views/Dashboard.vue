<template>
  <div class="dashboard">
    <div class="page-header">
      <h1>仪表盘</h1>
      <p>欢迎回来，{{ authStore.userInfo?.nickname }}！</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <IconEpUser />
        </div>
        <div class="stat-content">
          <h3>用户总数</h3>
          <p class="stat-number">1,234</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <IconEpDataAnalysis />
        </div>
        <div class="stat-content">
          <h3>今日访问</h3>
          <p class="stat-number">567</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <IconEpTrendCharts />
        </div>
        <div class="stat-content">
          <h3>销售额</h3>
          <p class="stat-number">¥89,012</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <IconEpShoppingCart />
        </div>
        <div class="stat-content">
          <h3>订单数</h3>
          <p class="stat-number">456</p>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>访问趋势</span>
              </div>
            </template>
            <div class="chart-placeholder">
              <IconEpTrendCharts class="placeholder-icon" />
              <p>图表区域</p>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>销售分析</span>
              </div>
            </template>
            <div class="chart-placeholder">
              <IconEpPieChart class="placeholder-icon" />
              <p>图表区域</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 快速操作 -->
    <el-card class="quick-actions">
      <template #header>
        <div class="card-header">
          <span>快速操作</span>
        </div>
      </template>

      <div class="actions-grid">
        <el-button type="primary" :icon="IconEpPlus" @click="handleAction('add')">
          新增用户
        </el-button>
        <el-button type="success" :icon="IconEpUpload" @click="handleAction('upload')">
          上传文件
        </el-button>
        <el-button type="info" :icon="IconEpSetting" @click="handleAction('settings')">
          系统设置
        </el-button>
        <el-button type="warning" :icon="IconEpView" @click="handleAction('view')">
          查看报告
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 处理快速操作
const handleAction = (action: string) => {
  ElMessage.info(`${action} 功能开发中...`)
}
</script>

<style lang="scss" scoped>
.dashboard {
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

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 24px;

    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 24px;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
        background: linear-gradient(135deg, #667eea, #764ba2);
        margin-right: 16px;
      }

      .stat-content {
        flex: 1;

        h3 {
          font-size: 14px;
          color: #7f8c8d;
          margin: 0 0 8px 0;
          font-weight: 500;
        }

        .stat-number {
          font-size: 28px;
          color: #2c3e50;
          font-weight: 700;
          margin: 0;
        }
      }
    }
  }

  .charts-section {
    margin-bottom: 24px;

    .chart-card {
      height: 300px;

      .chart-placeholder {
        height: 220px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #c0c4cc;

        .placeholder-icon {
          font-size: 48px;
          margin-bottom: 8px;
        }

        p {
          margin: 0;
          font-size: 14px;
        }
      }
    }
  }

  .quick-actions {
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;

      .el-button {
        height: 40px;
      }
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      font-weight: 600;
      color: #2c3e50;
    }
  }
}

@media (max-width: 768px) {
  .dashboard {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .charts-section {
      :deep(.el-col) {
        width: 100%;
        margin-bottom: 20px;
      }
    }

    .actions-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
}
</style>