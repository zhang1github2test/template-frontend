export interface ApiResponse<T = any> {
    code: number;
    data: T;
    message: string;
    success: boolean;
}

export interface PageResult<T> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
}