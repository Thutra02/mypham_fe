export interface RevenueReport {
  month: number;
  year: number;
  totalRevenue: number;
  totalDiscountedRevenue: number;
  totalOrders: number;
}

export interface RevenueReportResponse {
  data: RevenueReport[];
}

export interface orderStatusCount {
  status: string;
  orderCount: number;
}
