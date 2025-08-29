<template>
  <div class="user-form-container">
    <el-card class="user-form-card">
      <template #header>
        <div class="card-header">
          <span>{{ isEditMode ? '编辑用户' : '新增用户' }}</span>
        </div>
      </template>

      <el-form
          ref="formRef"
          :model="formModel"
          :rules="formRules"
          label-width="100px"
          @submit.prevent="handleSubmit"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
              v-model="formModel.username"
              placeholder="请输入用户名"
              :disabled="isEditMode"
          />
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input
              v-model="formModel.nickname"
              placeholder="请输入昵称"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
              v-model="formModel.email"
              placeholder="请输入邮箱"
          />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input
              v-model="formModel.phone"
              placeholder="请输入手机号"
          />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="formModel.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch
              v-model="formModel.status"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用"
          />
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              @click="handleSubmit"
              :loading="loading"
          >
            {{ isEditMode ? '更新' : '创建' }}
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'

// 类型定义
interface UserForm {
  username: string
  nickname: string
  email: string
  phone: string
  gender: string
  status: number
}

// 响应式数据
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

// 判断是否为编辑模式
const isEditMode = computed(() => route.name === 'UserEdit')

// 表单数据
const formModel = reactive<UserForm>({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  gender: 'male',
  status: 1
})

// 表单验证规则
const formRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { max: 50, message: '昵称长度不能超过50个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ]
})

// 加载用户数据（编辑模式）
const loadUserData = async (id: string) => {
  try {
    loading.value = true
    const userData = await userStore.getUserById(id)
    if (userData) {
      Object.assign(formModel, userData)
    }
  } catch (error) {
    ElMessage.error('加载用户数据失败')
  } finally {
    loading.value = false
  }
}

// 处理表单提交
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        if (isEditMode.value) {
          // 编辑用户
          const id = route.params.id as string
          await userStore.updateUser(id, formModel)
          ElMessage.success('用户更新成功')
        } else {
          // 新增用户
          await userStore.createUser(formModel)
          ElMessage.success('用户创建成功')
        }
        router.push('/user/list')
      } catch (error) {
        ElMessage.error(isEditMode.value ? '用户更新失败' : '用户创建失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 处理取消操作
const handleCancel = () => {
  ElMessageBox.confirm('确定要取消操作吗？未保存的数据将会丢失', '提示', {
    type: 'warning'
  }).then(() => {
    router.push('/user/list')
  }).catch(() => {
    // 用户取消操作
  })
}

// 组件挂载时的处理
onMounted(() => {
  if (isEditMode.value) {
    const userId = route.params.id as string
    if (userId) {
      loadUserData(userId)
    }
  }
})
</script>

<style scoped>
.user-form-container {
  padding: 20px;
}

.user-form-card {
  max-width: 600px;
  margin: 0 auto;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>