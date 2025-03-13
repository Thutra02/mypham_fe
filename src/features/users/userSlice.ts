import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { Pagination } from "../../types/pagination.types";
import { User, UserListResponse } from "../../types/user.types";

interface UserState {
  users: User[];
  user: User | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: UserState = {
  users: [],
  user: null,
  loading: false,
  error: null,
  pagination: null,
};

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
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
      `/api/user/all?page=${page - 1}&search=${search}&size=${size}`
    );
    console.log(response.data);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data as UserListResponse;
  }
);

export const addUser = createAsyncThunk(
  "user/addUser",
  async (newUser: User) => {
    const response = await api.post("/api/user", newUser);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as User;
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (updatedUser: User) => {
    const response = await api.put(`/api/user/${updatedUser.id}`, updatedUser);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as User;
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId: number) => {
    const response = await api.delete(`/api/user/${userId}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return userId;
  }
);

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId: number) => {
    const response = await api.get(`/api/user/${userId}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as User;
  }
);
export const blockUser = createAsyncThunk(
  "user/blockUser",
  async (userId: number) => {
    const response = await api.put(`/api/user/block/${userId}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return userId;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<UserListResponse>) => {
          state.loading = false;
          state.users = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add user";
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user";
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete user";
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserById.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      })
      .addCase(blockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blockUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload
        );
        if (index !== -1) {
          state.users[index].locked = !state.users[index].locked;
        }
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to block user";
      });
  },
});

export default userSlice.reducer;
