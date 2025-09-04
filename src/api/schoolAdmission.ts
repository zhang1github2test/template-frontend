import request from '@/utils/request'
import {ListParams, SchoolAdmission} from "@/types/shcoolAdmission.ts";

export const schoolAdmissionApi = {
    fetchSchoolAdmissionList: (params: ListParams) =>{
        return request.get('/api/school-admission', { params })
    },
    createSchoolAdmission: (data: SchoolAdmission) => {
        return request.post('/api/school-admission', data)
    },
    updateSchoolAdmission: (id: number, data: SchoolAdmission) => {
        return request.put(`/api/school-admission/${id}`, data)
    },
    deleteSchoolAdmission: (id: number) => {
        return request.delete(`/api/school-admission/${id}`)
    },
}