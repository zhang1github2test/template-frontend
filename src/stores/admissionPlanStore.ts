import { defineStore } from 'pinia';
import {admissionPlanApi} from '@/api/admissionPlanApi';
import { AdmissionPlan } from '@/types/admissionPlan.ts';

interface State {
    plans: AdmissionPlan[];
    total: number;
    loading: boolean;
    currentPlan: AdmissionPlan | null;
    pagination: {
        page: number;
        pageSize: number;
    };
    filters: {
        school_name: string;
        year: number | null;
        district_type: string;
    };
}

export const useAdmissionPlanStore = defineStore('admissionPlan', {
    state: (): State => ({
        plans: [],
        total: 0,
        loading: false,
        currentPlan: null,
        pagination: {
            page: 1,
            pageSize: 10,
        },
        filters: {
            school_name: '',
            year: null,
            district_type: '',
        },
    }),

    actions: {
        // 获取分页数据
        async fetchPlans() {
            this.loading = true;
            try {
                const params = {
                    page: this.pagination.page,
                    page_size: this.pagination.pageSize,
                    school_name: this.filters.school_name || undefined,
                    year: this.filters.year || undefined,
                    district_type: this.filters.district_type || undefined,
                };
                const res = await admissionPlanApi.getAdmissionPlans(params);
                if (res.success) {
                    const data = res.data
                    this.plans = data.list;
                    this.total = data.total;
                } else {
                    ElMessage.error(res.message);
                }
            } catch (err) {
                ElMessage.error('请求失败');
            } finally {
                this.loading = false;
            }
        },

        // 重置分页并刷新
        async refresh() {
            this.pagination.page = 1;
            await this.fetchPlans();
        },

        // 根据 ID 查询详情
        async fetchById(id: number) {
            const res = await admissionPlanApi.getAdmissionPlanById(id);
            if (res.success) {
                this.currentPlan = res.data as AdmissionPlan;
            } else {
                ElMessage.error(res.message);
            }
        },

        // 创建
        async create(plan: AdmissionPlan) {
            const res = await admissionPlanApi.createAdmissionPlan(plan);
            if (res.success) {
                ElMessage.success('创建成功');
                await this.refresh();
                return true;
            } else {
                ElMessage.error(res.message);
                return false;
            }
        },

        // 更新
        async update(id: number, plan: AdmissionPlan) {
            const res = await admissionPlanApi.updateAdmissionPlan(id, plan);
            if (res.success) {
                ElMessage.success('更新成功');
                await this.refresh();
                return true;
            } else {
                ElMessage.error(res.message);
                return false;
            }
        },

        // 删除
        async remove(id: number) {
            try {
                await ElMessageBox.confirm('确定删除该招生计划？', '警告', {
                    type: 'warning',
                });
                const res = await admissionPlanApi.deleteAdmissionPlan(id);
                if (res.success) {
                    ElMessage.success('删除成功');
                    await this.refresh();
                } else {
                    ElMessage.error(res.message);
                }
            } catch (err) {
                // 取消或异常
            }
        },

        // 设置分页
        setPage(page: number) {
            this.pagination.page = page;
            this.fetchPlans();
        },

        setPageSize(pageSize: number) {
            this.pagination.pageSize = pageSize;
            this.pagination.page = 1;
            this.fetchPlans();
        },

        // 设置查询条件
        setFilters(filters: { school_name: string; year: number | null; district_type: string }) {
            this.filters = { ...filters };
            this.refresh();
        },

        // 重置查询条件
        resetFilters() {
            this.filters = {
                school_name: '',
                year: null,
                district_type: '',
            };
            this.refresh();
        },
    },
});