import { Pagination } from "./pagination.types";

export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

export interface Discount {
  id?: number;
  name: string;
  discountCode: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount: number;
  maxUsage: number;
  usageCount: number;
  applicableProductId: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
}

export interface DiscountListResponse {
  status: string;
  message: string;
  data: Discount[];
  pagination: Pagination;
}
