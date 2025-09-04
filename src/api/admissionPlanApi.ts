import request from '@/utils/request';
import { AdmissionPlan } from '@/types/admissionPlan.ts';
import { ApiResponse,PageResult } from '@/types/ApiResponse';

// 查询参数类型
export interface PlanQueryParams {
    page?: number;
    page_size?: number;
    school_name?: string;
    year?: number;
    district_type?: string;
}

export const admissionPlanApi = {
    // 获取角色列表
    getAdmissionPlans: (params: PlanQueryParams): Promise<ApiResponse<PageResult<AdmissionPlan>>> => {
        return request.get('/api/plans', {params})
    },
    getAdmissionPlanById: (id: number): Promise<ApiResponse<AdmissionPlan>> => {
        return request.get(`/api/plans/${id}`)
    },
    createAdmissionPlan: (data: AdmissionPlan): Promise<ApiResponse<AdmissionPlan>> => {
        return request.post('/api/plans', data)
    },
    updateAdmissionPlan: (id: number, data: AdmissionPlan): Promise<ApiResponse<AdmissionPlan>> => {
        return request.put(`/api/plans/${id}`, data)
    },
    deleteAdmissionPlan: (id: number): Promise<ApiResponse<string>> => {
        return request.delete(`/api/plans/${id}`)
    },

}