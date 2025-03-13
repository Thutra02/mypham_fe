// Định nghĩa kiểu cho trạng thái auth
export interface AuthState {
  loading: boolean;
  userInfo: UserInfo | null;
  userToken: string | null;
  error: string | null;
  success: boolean;
}

// Định nghĩa kiểu cho thông tin người dùng
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  avatar: string;
  role: string;
  is_blocked: boolean;
  [key: string]: any; // Cho phép thêm thuộc tính động
}

// Định nghĩa kiểu cho dữ liệu gửi đi khi login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Định nghĩa kiểu cho dữ liệu gửi đi khi register
export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

// Định nghĩa kiểu cho response của login (dùng type vì có thể là union)
export type LoginResponse = {
  data: string;
};

export interface UserRequest {
  username: string;
  bio: string;
  phone: string;
}
