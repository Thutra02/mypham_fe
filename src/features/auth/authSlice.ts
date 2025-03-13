import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../../api/api";
import {
  AuthState,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  UserInfo,
  UserRequest,
} from "../../types/index";
import { uploadImage } from "../../utils/uploadImage";

// Khởi tạo userToken từ localStorage
const userToken = localStorage.getItem("userToken") || null;

// Async thunk cho login
export const userLogin = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  "auth/login",
  async ({ email, password }: LoginCredentials, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await api.post<LoginResponse>(
        `/api/user/login`,
        { email, password },
        config
      );

      localStorage.setItem("userToken", data.data);
      return data;
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

// Async thunk cho register
export const registerUser = createAsyncThunk<
  void,
  RegisterCredentials,
  { rejectValue: string }
>(
  "auth/register",
  async (
    { username, email, password }: RegisterCredentials,
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      await api.post(
        `/api/user/register`,
        { username, email, password },
        config
      );
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

export const updateUser = createAsyncThunk<
  UserInfo,
  UserRequest,
  { rejectValue: string }
>("auth/update", async (user: UserRequest, { rejectWithValue }) => {
  try {
    const { data } = await api.put<UserInfo>(`/api/user/update`, user);

    return data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosError.response?.data.message ||
        axiosError.message ||
        "An error occurred"
    );
  }
});

// change avatar
export const changeAvatar = createAsyncThunk<
  string,
  FormData,
  { rejectValue: string }
>("auth/changeAvatar", async (formData: FormData, { rejectWithValue }) => {
  try {
    const urlavatar = await uploadImage(formData);
    console.log(api.getUri() + "/api/" + urlavatar);
    await api.put<UserInfo>(`/api/user/avatar`, {
      avatar: api.getUri() + "/api" + urlavatar,
    });

    return api.getUri() + "/api" + urlavatar;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosError.response?.data.message ||
        axiosError.message ||
        "An error occurred"
    );
  }
});

export const changePassword = createAsyncThunk<
  void,
  { currentPassword: string; newPassword: string },
  { rejectValue: string }
>(
  "auth/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      await api.post(`/api/user/change-password`, {
        oldPassword: currentPassword,
        newPassword: newPassword,
      });
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
export const getUserInfo = createAsyncThunk("auth/getInfo", async () => {
  const { data } = await api.get<UserInfo>(`/api/user/me`);
  return data.data;
});

export const changePass = createAsyncThunk(
  "auth/changePass",
  async (
    {
      email,
      currentPassword,
      newPassword,
    }: { currentPassword: string; newPassword: string; email: string },
    { rejectWithValue }
  ) => {
    try {
      await api.post(
        `/api/user/password?email=${email}&password=${currentPassword}&newPassword=${newPassword}`
      );
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

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      await api.post(`/api/user/send-otp?email=${email}`);
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

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (
    {
      otp,
      email,
    }: {
      otp: string;
      email: string;
    },
    { rejectWithValue }
  ) => {
    try {
      await api.post(`/api/user/verify-otp?email=${email}&otp=${otp}`);
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

// Khởi tạo state
const initialState: AuthState = {
  loading: false,
  userInfo: null,
  userToken,
  error: null,
  success: false,
};

// Tạo slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("userToken");
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
      state.success = false;
    },
    setCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        userLogin.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.userToken = action.payload.data;
          state.success = true;
        }
      )
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<UserInfo>) => {
          state.loading = false;
          state.userInfo = action.payload;
          state.success = true;
        }
      )
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Update failed";
      })
      .addCase(getUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserInfo.fulfilled,
        (state, action: PayloadAction<UserInfo>) => {
          state.loading = false;
          state.userInfo = action.payload;
        }
      )
      .addCase(getUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Get user info failed";
      })
      .addCase(changeAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        changeAvatar.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.userInfo = {
            ...state.userInfo!,
            avatar: action.payload,
          };
          state.success = true;
        }
      )
      .addCase(changeAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Change avatar failed";
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
