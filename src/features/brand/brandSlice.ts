import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../../api/api";
import { Brand } from "../../types/brand.types";
import { Pagination } from "../../types/pagination.types";

interface BrandState {
  brands: Brand[];
  brand: Brand | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: BrandState = {
  brands: [],
  loading: false,
  brand: null,
  error: null,
  pagination: null,
};

export const fetchBrands = createAsyncThunk(
  "brand/fetchBrands",
  async ({
    page = 1,
    search = "",
    size = 10,
    isActive=false,
  }: {
    page?: number;
    search?: string;
    size?: number;
    isActive?: boolean;
  }) => {
    const response = await api.get(
      `/api/brand?page=${page - 1}&search=${search}&size=${size}&isActive=${isActive}`
    );
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data as { data: Brand[]; pagination: Pagination };
  }
);

export const addBrand = createAsyncThunk(
  "brand/addBrand",
  async (newBrand: Brand) => {
    const response = await api.post("/api/brand", newBrand);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Brand;
  }
);

export const updateBrand = createAsyncThunk(
  "brand/updateBrand",
  async (updatedBrand: Brand) => {
    const response = await api.put(
      `/api/brand/${updatedBrand.id}`,
      updatedBrand
    );
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Brand;
  }
);

export const deleteBrand = createAsyncThunk(
  "brand/deleteBrand",
  async (brandId: number, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/brand/${brandId}`);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return brandId;
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

export const fetchBrandById = createAsyncThunk(
  "brand/fetchBrandById",
  async (brandId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/brand/${brandId}`);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Brand;
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

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBrands.fulfilled,
        (
          state,
          action: PayloadAction<{ data: Brand[]; pagination: Pagination }>
        ) => {
          state.loading = false;
          state.brands = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch brands";
      })
      .addCase(addBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBrand.fulfilled, (state, action: PayloadAction<Brand>) => {
        state.loading = false;
        state.brands.push(action.payload);
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add brand";
      })
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action: PayloadAction<Brand>) => {
        state.loading = false;
        const index = state.brands.findIndex(
          (brand) => brand.id === action.payload.id
        );
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update brand";
      })
      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteBrand.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.brands = state.brands.filter(
            (brand) => brand.id !== action.payload
          );
        }
      )
      .addCase(deleteBrand.rejected, (state) => {
        state.loading = false;
       
      })
      .addCase(fetchBrandById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBrandById.fulfilled,
        (state, action: PayloadAction<Brand>) => {
          state.loading = false;
          state.brand = action.payload;
        }
      )
      .addCase(fetchBrandById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch brand";
      });
  },
});

export default brandSlice.reducer;
