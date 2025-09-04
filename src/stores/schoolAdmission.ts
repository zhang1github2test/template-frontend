import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SchoolAdmission, SchoolAdmissionQuery, PageResult } from '@/api/schoolAdmission'
import { schoolAdmissionApi } from '@/api/schoolAdmission'

export const useSchoolAdmissionStore = defineStore('schoolAdmission', () => {
    const list = ref<SchoolAdmission[]>([])
    const total = ref(0)
    const loading = ref(false)

    // 查询条件
    const query = ref<SchoolAdmissionQuery>({
        page: 1,
        pageSize: 10,
        schoolName: '',
        category: '',
        year: undefined
    })

    async function getList() {
        loading.value = true
        try {
            const { data } = await schoolAdmissionApi.fetchSchoolAdmissionList(query.value)
            list.value = data.list
            total.value = data.total
        } finally {
            loading.value = false
        }
    }

    async function addItem(item: SchoolAdmission) {
        await schoolAdmissionApi.createSchoolAdmission(item)
        await getList()
    }

    async function updateItem(id: number, item: SchoolAdmission) {
        await schoolAdmissionApi.updateSchoolAdmission(id, item)
        await getList()
    }

    async function removeItem(id: number) {
        await schoolAdmissionApi.deleteSchoolAdmission(id)
        await getList()
    }

    return { list, total, query, loading, getList, addItem, updateItem, removeItem }
})
