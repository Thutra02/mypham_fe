import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { Pagination } from "../../types/pagination.types";
import { orderStatusCount, RevenueReport } from "../../types/report.types";

interface ReportState {
  reports: RevenueReport[];
  report: RevenueReport | null;
  orderStatusCounts: orderStatusCount[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: ReportState = {
  reports: [],
  orderStatusCounts: [],
  loading: false,
  report: null,
  error: null,
  pagination: null,
};

export const fetchReports = createAsyncThunk(
  "report/fetchReports",
  async (year: number) => {
    const response = await api.get(`/api/reports/revenue?year=${year}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data as RevenueReport[];
  }
);

export const fetchOrderStatusCounts = createAsyncThunk(
  "report/fetchOrderStatusCounts",
  async () => {
    const response = await api.get("/api/reports/order-status-counts");
    console.log(response.data);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data as orderStatusCount[];
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
        state.error = null;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(fetchOrderStatusCounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderStatusCounts.fulfilled, (state, action) => {
        state.loading = false;
        state.orderStatusCounts = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderStatusCounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
  },
});

export default reportSlice.reducer;
