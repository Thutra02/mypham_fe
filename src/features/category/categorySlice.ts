import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { Category, CategoryListResponse } from "../../types/category.types";
import { Pagination } from "../../types/pagination.types";
import { AxiosError } from "axios";

interface CategoryState {
  categories: Category[];
  category: Category | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: CategoryState = {
  categories: [],
  category: null,
  loading: false,
  error: null,
  pagination: null,
};

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async ({
    page = 1,
    search = "",
    size,
    isActive = false,
  }: {
    page?: number;
    search?: string;
    size?: number;
    isActive?: boolean;
  }) => {
    console.log("fetchCategories", page, search, size);
    const response = await api.get(
      `/api/category?page=${
        page - 1
      }&search=${search}&size=${size}&isActive=${isActive}`
    );
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data as CategoryListResponse;
  }
);

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (newCategory: Category,{ rejectWithValue}) => {
    try {
      const response = await api.post("/api/category", newCategory);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Category;
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

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (updatedCategory: Category, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/category/${updatedCategory.id}`,
        updatedCategory
      );
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Category;
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

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId: number, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/category/${categoryId}`);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return categoryId;
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

export const fetchCategoryById = createAsyncThunk(
  "category/fetchCategoryById",
  async (categoryId: number) => {
    const response = await api.get(`/api/category/${categoryId}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Category;
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<CategoryListResponse>) => {
          state.loading = false;
          state.categories = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          state.categories.push(action.payload);
        }
      )
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add category";
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          const index = state.categories.findIndex(
            (category) => category.id === action.payload.id
          );
          if (index !== -1) {
            state.categories[index] = action.payload;
          }
        }
      )
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update category";
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCategory.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.categories = state.categories.filter(
            (category) => category.id !== action.payload
          );
        }
      )
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategoryById.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          state.category = action.payload;
        }
      )
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch category";
      });
  },
});

export default categorySlice.reducer;
