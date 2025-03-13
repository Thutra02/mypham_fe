import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { BlogCategory, BlogCategoryCount } from "../../types/blogCategory.types";
import { Pagination } from "../../types/pagination.types";
import { AxiosError } from "axios";

interface BlogCategoryState {
  categories: BlogCategory[];
  categoryCount: BlogCategoryCount[];
  loading: boolean;
  category: BlogCategory | null;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: BlogCategoryState = {
  categories: [],
  loading: false,
  categoryCount: [],
  category: null,
  error: null,
  pagination: null,
};

export const fetchBlogCategories = createAsyncThunk(
  "blogCategory/fetchBlogCategories",
  async ({
    page = 1,
    search = "",
    size = 10,
  }: {
    page?: number;
    search?: string;
    size?: number;
  }) => {
    const response = await api.get(
      `/api/blog-category?page=${page - 1}&search=${search}&size=${size}`
    );
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data as { data: BlogCategory[]; pagination: Pagination };
  }
);

export const addBlogCategory = createAsyncThunk(
  "blogCategory/addBlogCategory",
  async (newCategory: BlogCategory,{ rejectWithValue}) => {
    try {
      const response = await api.post("/api/blog-category", newCategory);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as BlogCategory;
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

export const updateBlogCategory = createAsyncThunk(
  "blogCategory/updateBlogCategory",
  async (updatedCategory: BlogCategory,{ rejectWithValue}) => {
    try {
      const response = await api.put(
        `/api/blog-category/${updatedCategory.id}`,
        updatedCategory
      );
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as BlogCategory;
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

export const deleteBlogCategory = createAsyncThunk(
  "blogCategory/deleteBlogCategory",
  async (categoryId: number,{ rejectWithValue}) => {
    try {
      const response = await api.delete(`/api/blog-category/${categoryId}`);
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

export const fetchBlogCategoryById = createAsyncThunk(
  "blogCategory/fetchBlogCategoryById",
  async (categoryId: number) => {
    const response = await api.get(`/api/blog-category/${categoryId}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as BlogCategory;
  }
);

export const fetchBlogCategoryCount = createAsyncThunk(
  "blogCategory/fetchBlogCategoryCount",
  async () => {
    const response = await api.get(`/api/blog-category/blog-count`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data as BlogCategoryCount[];
  }
);

const blogCategorySlice = createSlice({
  name: "blogCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBlogCategories.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: BlogCategory[];
            pagination: Pagination;
          }>
        ) => {
          state.loading = false;
          state.categories = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchBlogCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch blog categories";
      })
      .addCase(addBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addBlogCategory.fulfilled,
        (state, action: PayloadAction<BlogCategory>) => {
          state.loading = false;
          state.categories.push(action.payload);
        }
      )
      .addCase(addBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add blog category";
      })
      .addCase(updateBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateBlogCategory.fulfilled,
        (state, action: PayloadAction<BlogCategory>) => {
          state.loading = false;
          const index = state.categories.findIndex(
            (category) => category.id === action.payload.id
          );
          if (index !== -1) {
            state.categories[index] = action.payload;
          }
        }
      )
      .addCase(updateBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update blog category";
      })
      .addCase(deleteBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteBlogCategory.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.categories = state.categories.filter(
            (category) => category.id !== action.payload
          );
        }
      )
      .addCase(deleteBlogCategory.rejected, (state, action) => {
        state.loading = false;
       
      })
      .addCase(fetchBlogCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBlogCategoryById.fulfilled,
        (state, action: PayloadAction<BlogCategory>) => {
          state.loading = false;
          state.category = action.payload;
        }
      )
      .addCase(fetchBlogCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch blog category";
      })
      .addCase(fetchBlogCategoryCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBlogCategoryCount.fulfilled,
        (state, action: PayloadAction<BlogCategoryCount[]>) => {
          state.loading = false;
          state.categoryCount = action.payload;
        }
      )
      .addCase(fetchBlogCategoryCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch blog category count";
      });
  },
});

export default blogCategorySlice.reducer;
