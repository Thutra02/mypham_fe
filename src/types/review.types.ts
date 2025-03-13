import { Pagination } from "./pagination.types";
import { User } from "./user.types";

// Model cho Review (giả định cấu trúc cơ bản)
export interface Review {
  id: number; // Long trong Java ánh xạ thành number trong TypeScript
  review: string; // Nội dung đánh giá
  star: number; // double trong Java ánh xạ thành number trong TypeScript
  user:User; // Quan hệ ManyToOne với User
  createdDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  updatedDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
}

export interface ReviewListResponse {
  status: string;
  message: string;
  data: Review[];
  pagination: Pagination;
}

export interface ReviewRequest {
  review: string;
  star: number;
  productId: number;
}
