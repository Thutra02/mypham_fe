import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { Pagination } from "../../types/pagination.types";
import { Tag, TagListResponse } from "../../types/tag.types";
 
interface TagState {
  tags: Tag[];
  tag: Tag | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: TagState = {
  tags: [],
  tag: null,
  loading: false,
  error: null,
  pagination: null,
};

export const fetchTags = createAsyncThunk(
  "tag/fetchTags",
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
      `/api/tags?page=${page - 1}&search=${search}&size=${size}`
    );
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data as TagListResponse;
  }
);

export const addTag = createAsyncThunk(
  "tag/addTag",
  async (newTag: Tag) => {
    const response = await api.post("/api/tags", newTag);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Tag;
  }
);

export const updateTag = createAsyncThunk(
  "tag/updateTag",
  async (updatedTag: Tag) => {
    const response = await api.put(
      `/api/tags/${updatedTag.id}`,
      updatedTag
    );
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Tag;
  }
);

export const deleteTag = createAsyncThunk(
  "tag/deleteTag",
  async (tagId: number) => {
    const response = await api.delete(`/api/tags/${tagId}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return tagId;
  }
);

export const fetchTagById = createAsyncThunk(
  "tag/fetchTagById",
  async (tagId: number) => {
    const response = await api.get(`/api/tags/${tagId}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Tag;
  }
);

const tagSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTags.fulfilled,
        (state, action: PayloadAction<TagListResponse>) => {
          state.loading = false;
          state.tags = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tags";
      })
      .addCase(addTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addTag.fulfilled,
        (state, action: PayloadAction<Tag>) => {
          state.loading = false;
          state.tags.push(action.payload);
        }
      )
      .addCase(addTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add tag";
      })
      .addCase(updateTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateTag.fulfilled,
        (state, action: PayloadAction<Tag>) => {
          state.loading = false;
          const index = state.tags.findIndex(
            (tag) => tag.id === action.payload.id
          );
          if (index !== -1) {
            state.tags[index] = action.payload;
          }
        }
      )
      .addCase(updateTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update tag";
      })
      .addCase(deleteTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteTag.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.tags = state.tags.filter(
            (tag) => tag.id !== action.payload
          );
        }
      )
      .addCase(deleteTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete tag";
      })
      .addCase(fetchTagById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTagById.fulfilled,
        (state, action: PayloadAction<Tag>) => {
          state.loading = false;
          state.tag = action.payload;
        }
      )
      .addCase(fetchTagById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tag";
      });
  },
});

export default tagSlice.reducer;
