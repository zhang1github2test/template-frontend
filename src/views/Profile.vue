<template>
  <div class="profile">
    <div class="page-header">
      <h1>个人中心</h1>
      <p>管理您的个人信息和账户设置</p>
    </div>

    <el-row :gutter="20">
      <!-- 左侧用户信息 -->
      <el-col :span="8">
        <el-card class="user-card">
          <div class="user-avatar">
            <el-avatar :size="100" :src="userInfo.avatar">
              {{ userInfo.nickname?.charAt(0) || 'U' }}
            </el-avatar>
            <el-button type="text" class="upload-btn" @click="handleAvatarUpload">
              <IconEpCamera />
              更换头像
            </el-button>
          </div>

          <div class="user-info">
            <h3>{{ userInfo.nickname }}</h3>
            <p class="user-email">{{ userInfo.email }}</p>
            <div class="user-roles">
              <el-tag
                  v-for="role in userInfo.roles"
                  :key="role"
                  type="primary"
                  size="small"
              >
                {{ role }}
              </el-tag>
            </div>
          </div>

          <div class="user-stats">
            <div class="stat-item">
              <span class="label">注册时间</span>
              <span class="value">{{ formatDate(userInfo.createdAt) }}</span>
            </div>
            <div class="stat-item">
              <span class="label">最后登录</span>
              <span class="value">{{ formatDate(userInfo.updatedAt) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧表单 -->
      <el-col :span="16">
        <el-card class="form-card">
          <template #header>
            <div class="card-header">
              <span>基本信息</span>
            </div>
          </template>

          <el-form
              ref="profileFormRef"
              :model="profileForm"
              :rules="rules"
              label-width="100px"
              size="large"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="profileForm.username" disabled />
            </el-form-item>

            <el-form-item label="昵称" prop="nickname">
              <el-input
                  v-model="profileForm.nickname"
                  placeholder="请输入昵称"
                  clearable
              />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input
                  v-model="profileForm.email"
                  placeholder="请输入邮箱"
                  clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :loading="loading" @click="handleSave">
                保存修改
              </el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 修改密码 -->
        <el-card class="form-card" style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span>修改密码</span>
            </div>
          </template>

          <el-form
              ref="passwordFormRef"
              :model="passwordForm"
              :rules="passwordRules"
              label-width="100px"
              size="large"
          >
            <el-form-item label="当前密码" prop="oldPassword">
              <el-input
                  v-model="passwordForm.oldPassword"
                  type="password"
                  placeholder="请输入当前密码"
                  show-password
                  clearable
              />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input
                  v-model="passwordForm.newPassword"
                  type="password"
                  placeholder="请输入新密码"
                  show-password
                  clearable
              />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  placeholder="请确认新密码"
                  show-password
                  clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :loading="passwordLoading" @click="handleChangePassword">
                修改密码
              </el-button>
              <el-button @click="handlePasswordReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import type { FormInstance, FormRules } from 'element-plus'
import dayjs from 'dayjs'

const authStore = useAuthStore()

// 表单引用
const profileFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)
const passwordLoading = ref(false)

// 用户信息（从store获取）
const userInfo = computed(() => authStore.userInfo || {
  id: 1,
  username: 'admin',
  email: 'admin@example.com',
  nickname: '管理员',
  avatar: '',
  roles: ['admin'],
  permissions: [],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z'
})

// 个人信息表单
const profileForm = reactive({
  username: '',
  nickname: '',
  email: ''
})

// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 表单验证规则
const rules: FormRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const passwordRules: FormRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 初始化表单数据
const initFormData = () => {
  profileForm.username = userInfo.value.username
  profileForm.nickname = userInfo.value.nickname
  profileForm.email = userInfo.value.email
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 处理头像上传
const handleAvatarUpload = () => {
  ElMessage.info('头像上传功能开发中...')
}

// 保存个人信息
const handleSave = async () => {
  if (!profileFormRef.value) return

  try {
    const valid = await profileFormRef.value.validate()
    if (valid) {
      loading.value = true
      // 这里调用API保存用户信息
      // await userApi.updateProfile(profileForm)
      ElMessage.success('保存成功')
    }
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

// 重置个人信息表单
const handleReset = () => {
  initFormData()
}

// 修改密码
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return

  try {
    const valid = await passwordFormRef.value.validate()
    if (valid) {
      passwordLoading.value = true
      await authApi.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      })
      ElMessage.success('密码修改成功')
      handlePasswordReset()
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '密码修改失败')
  } finally {
    passwordLoading.value = false
  }
}

// 重置密码表单
const handlePasswordReset = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordFormRef.value?.clearValidate()
}

// 组件挂载时初始化数据
onMounted(() => {
  initFormData()
})
</script>

<style lang="scss" scoped>
.profile {
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

  .user-card {
    text-align: center;

    .user-avatar {
      margin-bottom: 20px;

      .upload-btn {
        display: block;
        margin: 12px auto 0;
        color: #409eff;
        font-size: 14px;

        &:hover {
          background-color: #f0f9ff;
        }
      }
    }

    .user-info {
      margin-bottom: 24px;

      h3 {
        font-size: 20px;
        color: #2c3e50;
        margin: 0 0 8px 0;
        font-weight: 600;
      }

      .user-email {
        color: #7f8c8d;
        margin: 0 0 12px 0;
        font-size: 14px;
      }

      .user-roles {
        display: flex;
        justify-content: center;
        gap: 8px;
        flex-wrap: wrap;
      }
    }

    .user-stats {
      .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #f5f5f5;

        &:last-child {
          border-bottom: none;
        }

        .label {
          color: #7f8c8d;
          font-size: 14px;
        }

        .value {
          color: #2c3e50;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
  }

  .form-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-weight: 600;
        color: #2c3e50;
      }
    }

    .el-form-item {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

@media (max-width: 768px) {
  .profile {
    :deep(.el-col) {
      width: 100%;
      margin-bottom: 20px;
    }
  }
}
</style>