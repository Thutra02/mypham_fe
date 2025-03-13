import { Pagination } from "./pagination.types";

export interface Tag {
  id: number;
  name: string;
}

export interface TagListResponse {
  status: string;
  message: string;
  data: Tag[];
  pagination: Pagination;
}
