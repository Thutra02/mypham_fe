import { Pagination } from "./pagination.types";

export interface Category {
  id: number; // Long trong Java ánh xạ thành number trong TypeScript
  name: string;
  description: string;
  image: string;
  active: boolean;
  createdDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  updatedDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
}

// Type cho danh sách danh mục (response từ API)

export interface CategoryListResponse {
  status: string;
  message: string;
  data: Category[];
  pagination: Pagination;
}

export interface CategoryRequest {
  name: string;
  description: string;
  image: string;
  active: boolean;
}
