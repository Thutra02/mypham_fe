import { Pagination } from "./pagination.types";

export interface BlogCategory {
    id: number; // Long trong Java ánh xạ thành number trong TypeScript
    name: string;
    description: string;
    createdDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
    updatedDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
}

// Type cho danh sách danh mục blog (response từ API)
export type BlogCategoryListResponse = {
    status: string;
    message: string;
    data: BlogCategory[];
    pagination: Pagination;
};

export interface BlogCategoryCount {
    id: number;
    name: string;
    description: string;
    blogCount: number;
}