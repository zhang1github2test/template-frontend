<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <div class="error-message">
        <h2>页面未找到</h2>
        <p>抱歉，您访问的页面不存在或已被删除</p>
      </div>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">
          <IconEpHomeFilled />
          返回首页
        </el-button>
        <el-button @click="goBack">
          <IconEpBack />
          返回上页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const goHome = () => {
  router.push('/dashboard')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .not-found-content {
    text-align: center;
    color: white;

    .error-code {
      font-size: 120px;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 20px;
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .error-message {
      margin-bottom: 40px;

      h2 {
        font-size: 28px;
        margin: 0 0 12px 0;
        font-weight: 600;
      }

      p {
        font-size: 16px;
        margin: 0;
        opacity: 0.9;
      }
    }

    .error-actions {
      display: flex;
      gap: 16px;
      justify-content: center;

      .el-button {
        padding: 12px 24px;
        font-size: 16px;
      }
    }
  }
}

@media (max-width: 768px) {
  .not-found {
    padding: 20px;

    .not-found-content {
      .error-code {
        font-size: 80px;
      }

      .error-message {
        h2 {
          font-size: 24px;
        }

        p {
          font-size: 14px;
        }
      }

      .error-actions {
        flex-direction: column;
        align-items: center;

        .el-button {
          width: 200px;
        }
      }
    }
  }
}
</style>