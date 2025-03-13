import { Pagination } from "./pagination.types";

export interface Address {
  id: number; // Long trong Java ánh xạ thành number trong TypeScript
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  default: boolean;
  createdDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  updatedDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
}

export interface AddressListResponse {
  status: string;
  message: string;
  data: Address[];
  pagination: Pagination;
}
