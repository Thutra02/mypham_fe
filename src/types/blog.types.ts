import { BlogCategory } from "./blogCategory.types";
import { Pagination } from "./pagination.types";
import { Tag } from "./tag.types";
import { User } from "./user.types";

// Model cho Tag (giả định cấu trúc cơ bản)

// Model cho Blog
export interface Blog {
  id: number; // Long trong Java ánh xạ thành number trong TypeScript
  title: string;
  content: string;
  image: string;
  status: string;
  createdDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  updatedDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  category: BlogCategory; // Quan hệ ManyToOne với BlogCategory
  author: User; // Quan hệ ManyToOne với User (UserInfo đã định nghĩa trước đó)
  tags: Tag[]; // Quan hệ ManyToMany với Tag, ánh xạ thành mảng
}

export interface BlogRequest {
  id: number; // Long trong Java ánh xạ thành number trong TypeScript
  title: string;
  content: string;
  image: string;
  status: string;
  createdDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  updatedDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  categoryId:  number; 
  author: number;
  tags:  string[];
}

export interface BlogListResponse {
  status: string;
  message: string;
  data: Blog[];
  pagination: Pagination;
}

// Type cho chi tiết blog (response từ API)
export type BlogDetailsResponse = Blog;
