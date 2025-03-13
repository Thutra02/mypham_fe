import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../../api/api";
import { Discount, DiscountListResponse } from "../../types/discount.types";
import { Pagination } from "../../types/pagination.types";

interface DiscountState {
  discounts: Discount[];
  discount: Discount | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: DiscountState = {
  discounts: [],
  discount: null,
  loading: false,
  error: null,
  pagination: null,
};

export const fetchDiscounts = createAsyncThunk(
  "discount/fetchDiscounts",
  async (
    {
      page = 1,
      search = "",
      size = 10,
    }: {
      page?: number;
      search?: string;
      size?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/api/discounts?page=${page - 1}&search=${search}&size=${size}`
      );
      console.log(response.data);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data as DiscountListResponse;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message ||
          axiosError.message ||
          "An error occurred"
      );
    }
  }
);

export const addDiscount = createAsyncThunk(
  "discount/addDiscount",
  async (newDiscount: Discount, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/discounts", newDiscount);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Discount;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message ||
          axiosError.message ||
          "An error occurred"
      );
    }
  }
);

export const updateDiscount = createAsyncThunk(
  "discount/updateDiscount",
  async (updatedDiscount: Discount, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/discounts/${updatedDiscount.id}`,
        updatedDiscount
      );
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Discount;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message ||
          axiosError.message ||
          "An error occurred"
      );
    }
  }
);

export const deleteDiscount = createAsyncThunk(
  "discount/deleteDiscount",
  async (discountId: number, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/discounts/${discountId}`);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return discountId;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message ||
          axiosError.message ||
          "An error occurred"
      );
    }
  }
);

export const fetchDiscountById = createAsyncThunk(
  "discount/fetchDiscountById",
  async (discountId: number) => {
    const response = await api.get(`/api/discounts/${discountId}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Discount;
  }
);
export const applyDiscount = createAsyncThunk(
  "discount/applyDiscount",
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/discounts/apply", { code });
      console.log(response.data);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as number;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message ||
          axiosError.message ||
          "An error occurred"
      );
    }
  }
);

const discountSlice = createSlice({
  name: "discount",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDiscounts.fulfilled,
        (state, action: PayloadAction<DiscountListResponse>) => {
          state.loading = false;
          state.discounts = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch discounts";
      })
      .addCase(addDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addDiscount.fulfilled,
        (state, action: PayloadAction<Discount>) => {
          state.loading = false;
          state.discounts.push(action.payload);
        }
      )
      .addCase(addDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add discount";
      })
      .addCase(updateDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateDiscount.fulfilled,
        (state, action: PayloadAction<Discount>) => {
          state.loading = false;
          const index = state.discounts.findIndex(
            (discount) => discount.id === action.payload.id
          );
          if (index !== -1) {
            state.discounts[index] = action.payload;
          }
        }
      )
      .addCase(updateDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update discount";
      })
      .addCase(deleteDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteDiscount.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.discounts = state.discounts.filter(
            (discount) => discount.id !== action.payload
          );
        }
      )
      .addCase(deleteDiscount.rejected, (state, action) => {
        state.loading = false;
      
      })
      .addCase(fetchDiscountById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDiscountById.fulfilled,
        (state, action: PayloadAction<Discount>) => {
          state.loading = false;
          state.discount = action.payload;
        }
      )
      .addCase(fetchDiscountById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch discount";
      });
  },
});

export default discountSlice.reducer;
