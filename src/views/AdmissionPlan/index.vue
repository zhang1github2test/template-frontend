<template>
  <div class="admission-plan-container">
    <h2>招生计划管理</h2>

    <!-- 查询表单 -->
    <SearchForm />

    <!-- 操作按钮 -->
    <div style="margin-bottom: 16px">
      <el-button type="success" @click="handleCreate">新增计划</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="store.plans" border v-loading="store.loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="school_name" label="学校名称" min-width="140" />
      <el-table-column prop="year" label="年份" width="100" />
      <el-table-column prop="district_type" label="区属类型" width="120" />
      <el-table-column prop="school_level" label="学校等级" width="120" />
      <el-table-column prop="operation_nature" label="办学性质" width="120" />
      <el-table-column prop="admission_scope" label="招生范围" width="120" />
      <el-table-column prop="total_students" label="总人数" width="100" />
      <el-table-column prop="boarding_students" label="住宿" width="100" />
      <el-table-column prop="day_students" label="走读" width="100" />
      <el-table-column prop="acd_students" label="指标生总数" width="100" />
      <el-table-column prop="ac_students" label="AC类指标生" width="100" />
      <el-table-column prop="d_students" label="D类指标生" width="100" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          v-model:current-page="store.pagination.page"
          v-model:page-size="store.pagination.pageSize"
          :total="store.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>

    <!-- 弹窗表单 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
      <el-form :model="form" label-width="100px" ref="formRef" :rules="rules">
        <el-form-item label="学校名称" prop="school_name">
          <el-input v-model="form.school_name" />
        </el-form-item>
        <el-form-item label="年份" prop="year">
          <el-input-number v-model="form.year" :min="2000" :max="2100" style="width: 100%" />
        </el-form-item>
        <el-form-item label="区属类型" prop="district_type">
          <el-input v-model="form.district_type" />
        </el-form-item>
        <el-form-item label="学校等级" prop="school_level">
          <el-input v-model="form.school_level" />
        </el-form-item>
        <el-form-item label="办学性质" prop="operation_nature">
          <el-input v-model="form.operation_nature" />
        </el-form-item>
        <el-form-item label="招生范围" prop="admission_scope">
          <el-input v-model="form.admission_scope" type="textarea" />
        </el-form-item>
        <el-form-item label="总人数" prop="total_students">
          <el-input-number v-model="form.total_students" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAdmissionPlanStore } from '@/stores/admissionPlanStore';
import { AdmissionPlan } from '@/types/admissionPlan.ts';
import SearchForm from './components/SearchForm.vue';

defineOptions({ name: 'AdmissionPlanList' });

const store = useAdmissionPlanStore();
const dialogVisible = ref(false);
const formRef = ref();
const isEdit = ref(false);

const form = ref<AdmissionPlan>({
  id: undefined,
  schoolName: '',
  year: new Date().getFullYear(),
  districtType: '',
  schoolLevel: '',
  operationNature: '',
  admissionScope: '',
  totalStudents: 0,
  boardingStudents: 0,
  dayStudents: 0,
  acStudents: 0,
  acdStudents: 0,
  dStudents: 0,
  remarks: '',
});

const rules = {
  schoolName: [{ required: true, message: '请输入学校名称', trigger: 'blur' }],
  year: [{ required: true, message: '请选择年份', trigger: 'change' }],
  totalStudents: [{ required: true, message: '请输入总人数', trigger: 'blur' }],
};

const dialogTitle = computed(() => (isEdit.value ? '编辑招生计划' : '新增招生计划'));

// 初始化加载
onMounted(() => {
  store.fetchPlans();
});

// 分页变化
const handleCurrentChange = (page: number) => store.setPage(page);
const handleSizeChange = (size: number) => store.setPageSize(size);

// 打开新增
const handleCreate = () => {
  isEdit.value = false;
  form.value = {
    schoolName: '',
    year: new Date().getFullYear(),
    districtType: '',
    schoolLevel: '',
    operationNature: '',
    admissionScope: '',
    totalStudents: 0,
  } as AdmissionPlan;
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: AdmissionPlan) => {
  await store.fetchById(row.id!);
  Object.assign(form.value, store.currentPlan);
  isEdit.value = true;
  dialogVisible.value = true;
};

// 删除
const handleDelete = (id: number) => {
  store.remove(id);
};

// 提交表单
const submitForm = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    if (isEdit.value) {
      await store.update(form.value.id!, form.value);
    } else {
      await store.create(form.value);
    }

    dialogVisible.value = false;
  });
};
</script>

<style scoped>
.admission-plan-container {
  padding: 20px;
  background-color: #f9fafb;
}

.pagination {
  margin-top: 20px;
  justify-content: center;
  display: flex;
}

h2 {
  margin-bottom: 20px;
  color: #1f2d3d;
  font-weight: 500;
}
</style>