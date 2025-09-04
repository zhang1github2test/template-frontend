export interface SchoolAdmission {
    id?: number
    schoolCode: string
    schoolName: string
    category: string
    totalScore: number
    tieBreaker?: string
    admissionScope?: string
    year: number
    createdAt?: string
    updatedAt?: string
}

export interface ListParams {
    page: number
    pageSize: number
    schoolName?: string
    year?: number
}