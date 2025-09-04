export interface AdmissionPlan {
    id?: number;
    school_name: string;
    year: number;
    district_type: string;
    school_level: string;
    operation_nature: string;
    admission_scope: string;
    total_students: number;
    boarding_students: number;
    day_students: number;
    ac_students: number;
    acd_students: number;
    d_students: number;
    remarks: string;
}