import { Pagination } from "./pagination.types";

export interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
}

export interface ContactListResponse {
  status: string;
  message: string;
  data: Contact[];
  pagination: Pagination;
}
