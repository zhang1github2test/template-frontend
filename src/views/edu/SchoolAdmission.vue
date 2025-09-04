<template>
  <div class="school-admission p-4">
    <!-- 搜索表单 -->
    <el-card class="mb-4">
      <el-form :inline="true" :model="store.query">
        <el-form-item label="学校名称">
          <el-input v-model="store.query.schoolName" placeholder="请输入学校名称" clearable />
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="store.query.category" placeholder="请选择类别"   value-key="category" clearable style="width: 100px">
            <el-option label="住宿" value="住宿" />
            <el-option label="走读" value="走读" />
          </el-select>
        </el-form-item>
        <el-form-item label="年份">
          <el-input-number v-model="store.query.year" :min="2000" placeholder="年份" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
        <el-form-item class="ml-auto">
          <el-button type="primary" @click="openDialog()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-table :data="store.list" v-loading="store.loading" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="schoolCode" label="学校代码" />
      <el-table-column prop="schoolName" label="学校名称" />
      <el-table-column prop="category" label="类别" />
      <el-table-column prop="totalScore" label="总分" />
      <el-table-column prop="tieBreaker" label="同分条件" />
      <el-table-column prop="admissionScope" label="招生范围" />
      <el-table-column prop="year" label="年份" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 分页 -->
    <div class="flex justify-end mt-4">
      <el-pagination
          background
          layout="prev, pager, next, jumper, ->, total"
          :total="store.total"
          :page-size="store.query.pageSize"
          :current-page="store.query.page"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
      />
    </div>

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑' : '新增'">
      <el-form :model="form" label-width="100px">
        <el-form-item label="学校代码">
          <el-input v-model="form.schoolCode" />
        </el-form-item>
        <el-form-item label="学校名称">
          <el-input v-model="form.schoolName" />
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="form.category"
                     placeholder="请选择类别"
                     clearable
                     style="width: 120px">
            <el-option label="住宿" value="住宿" />
            <el-option label="走读" value="走读" />
          </el-select>
        </el-form-item>
        <el-form-item label="总分">
          <el-input-number v-model="form.totalScore" :min="0" />
        </el-form-item>
        <el-form-item label="同分条件">
          <el-input v-model="form.tieBreaker" />
        </el-form-item>
        <el-form-item label="招生范围">
          <el-input v-model="form.admissionScope" />
        </el-form-item>
        <el-form-item label="年份">
          <el-input-number v-model="form.year" :min="2000" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSchoolAdmissionStore } from '@/stores/schoolAdmission'
import type { SchoolAdmission } from '@/api/schoolAdmission'

const store = useSchoolAdmissionStore()
const dialogVisible = ref(false)
const form = ref<SchoolAdmission>({
  schoolCode: '',
  schoolName: '',
  category: '',
  totalScore: 0,
  year: new Date().getFullYear()
})

function openDialog(row?: SchoolAdmission) {
  if (row) {
    form.value = { ...row }
  } else {
    form.value = {
      schoolCode: '',
      schoolName: '',
      category: '',
      totalScore: 0,
      year: new Date().getFullYear()
    }
  }
  dialogVisible.value = true
}

async function handleSubmit() {
  if (form.value.id) {
    await store.updateItem(form.value.id, form.value)
  } else {
    await store.addItem(form.value)
  }
  dialogVisible.value = false
}

async function handleDelete(id: number) {
  await store.removeItem(id)
}

function handleSearch() {
  store.query.page = 1
  store.getList()
}

function resetSearch() {
  store.query.schoolName = ''
  store.query.category = ''
  store.query.year = undefined
  store.query.page = 1
  store.getList()
}

function handlePageChange(page: number) {
  store.query.page = page
  store.getList()
}

function handleSizeChange(size: number) {
  store.query.pageSize = size
  store.query.page = 1
  store.getList()
}

onMounted(() => {
  store.getList()
})
</script>
