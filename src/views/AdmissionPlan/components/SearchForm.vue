<template>
  <el-form :model="filters" label-width="100px" inline @submit.prevent="onSubmit">
    <el-form-item label="学校名称">
      <el-input v-model="filters.school_name" placeholder="请输入学校名称" clearable />
    </el-form-item>

    <el-form-item label="年份">
      <el-input-number v-model="filters.year" :min="2000" :max="2100" placeholder="年份" />
    </el-form-item>

    <el-form-item label="区属类型">
      <el-input v-model="filters.district_type" placeholder="如：市属、区属" clearable />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button @click="onReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useAdmissionPlanStore } from '@/stores/admissionPlanStore';

defineOptions({ name: 'SearchForm' });

const store = useAdmissionPlanStore();

const filters = reactive({ ...store.filters });

const onSubmit = () => {
  store.setFilters(filters);
};

const onReset = () => {
  filters.school_name = '';
  filters.year = null;
  filters.district_type = '';
  store.resetFilters();
};
</script>