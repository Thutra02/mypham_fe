import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../../api/api";
import { Blog, BlogRequest } from "../../types/blog.types";
import { Pagination } from "../../types/pagination.types";

interface BlogState {
  blogs: Blog[];
  blogNew: Blog[];
  blog: Blog | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: BlogState = {
  blogs: [],
  blogNew: [],
  blog: null,
  loading: false,
  error: null,
  pagination: null,
};

export const fetchBlogs = createAsyncThunk(
  "blog/fetchBlogs",
  async (
    {
      page = 1,
      search = "",
      size = 5,
    }: {
      page?: number;
      search?: string;
      size?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/api/blog?page=${page - 1}&search=${search}&size=${size}`
      );
      console.log(response.data);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data as { data: Blog[]; pagination: Pagination };
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

export const addBlog = createAsyncThunk(
  "blog/addBlog",
  async (newBlog: BlogRequest, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/blog", newBlog);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Blog;
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

export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async (updatedBlog: BlogRequest, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/blog/${updatedBlog.id}`,
        updatedBlog
      );
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Blog;
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

export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (blogId: number, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/blog/${blogId}`);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return blogId;
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
export const fetchBlogById = createAsyncThunk(
  "blog/fetchBlogById",
  async (blogId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/blog/${blogId}`);
      console.log("loading blog", response.data);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Blog;
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

export const fetchNewBlog = createAsyncThunk(
  "blog/fetchNewBlog",
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/blog/latest");
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      console.log(response.data.data);
      return response.data.data as Blog[];
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

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBlogs.fulfilled,
        (
          state,
          action: PayloadAction<{ data: Blog[]; pagination: Pagination }>
        ) => {
          state.loading = false;
          state.blogs = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch blogs";
      })
      .addCase(addBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBlog.fulfilled, (state, action: PayloadAction<Blog>) => {
        state.loading = false;
        state.blogs.push(action.payload);
      })
      .addCase(addBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add blog";
      })
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action: PayloadAction<Blog>) => {
        state.loading = false;
        const index = state.blogs.findIndex(
          (blog) => blog.id === action.payload.id
        );
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update blog";
      })
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
       })
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBlogById.fulfilled,
        (state, action: PayloadAction<Blog>) => {
          state.loading = false;
          state.blog = action.payload;
        }
      )
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch blog";
      })
      .addCase(fetchNewBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchNewBlog.fulfilled,
        (state, action: PayloadAction<Blog[]>) => {
          state.loading = false;
          state.blogNew = action.payload;
        }
      )
      .addCase(fetchNewBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch new blogs";
      });
  },
});

export default blogSlice.reducer;
