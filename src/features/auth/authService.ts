import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  UserInfo,
} from "../../types";

// Lấy base URL từ environment
const baseUrl =
  import.meta.env.MODE !== "production"
    ? "http://127.0.0.1:9000/"
    : import.meta.env.VITE_SERVER_URL;

// Định nghĩa API với RTK Query
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Ép kiểu getState để lấy userToken từ Redux store
      const state = getState() as { auth: { userToken: string | null } };
      const token =  localStorage.getItem("userToken") || state.auth.userToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User"], // Thêm tag để quản lý cache
  endpoints: (build) => ({
    // Lấy thông tin user (query)
    getUserDetails: build.query<UserInfo, void>({
      query: () => ({
        url: "api/user/me",
        method: "GET",
      }),
      providesTags: ["User"], // Gắn tag cho cache
    }),

    // Đăng nhập (mutation)
    login: build.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "api/user/login",
        method: "POST",
        body: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["User"], // Xóa cache khi login thành công
    }),

    // Đăng ký (mutation)
    register: build.mutation<void, RegisterCredentials>({
      query: (credentials) => ({
        url: "api/user/register",
        method: "POST",
        body: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // Đăng xuất (mutation)
    logout: build.mutation<void, void>({
      query: () => ({
        url: "api/user/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"], // Xóa cache khi logout
    }),
  }),
});

// Export các hook được sinh tự động
export const {
  useGetUserDetailsQuery, // Hook cho query lấy thông tin user
  useLoginMutation, // Hook cho mutation đăng nhập
  useRegisterMutation, // Hook cho mutation đăng ký
  useLogoutMutation, // Hook cho mutation đăng xuất
} = authApi;
