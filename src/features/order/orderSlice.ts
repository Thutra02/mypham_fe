import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../../api/api";
import { Order, OrderRequest } from "../../types/order.types";
import { Pagination } from "../../types/pagination.types";

interface OrderState {
  orders: Order[];
  orderDetails: Order | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: OrderState = {
  orders: [],
  orderDetails: null,
  loading: false,
  error: null,
  pagination: null,
};

export const fetchAllOrders = createAsyncThunk(
  "order/fetchAllOrders",
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
      `/api/orders?page=${page - 1}&search=${search}&size=${size}`
    );
    console.log(response);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data as { data: Order[]; pagination: Pagination };
  }
);

export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/orders/user`);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Order[];
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

export const fetchOrderDetails = createAsyncThunk(
  "order/fetchOrderDetails",
  async (id: number) => {
    const response = await api.get(`/api/orders/${id}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Order;
  }
);

export const addOrder = createAsyncThunk(
  "order/addOrder",
  async (newOrder: OrderRequest, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/orders", newOrder);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Order;
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

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ id, status }: { id: number; status: string }) => {
    const response = await api.put(`/api/orders/${id}/status`, { status });
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return { id, status } as { id: number; status: string };
  }
);

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async ({
    page,
    search,
    size,
  }: {
    page: number;
    search: string;
    size: number;
  }) => {
    const response = await api.get(
      `/api/orders?page=${page - 1}&orderId=${search}&size=${size}`
    );
    console.log(response.data);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data as { data: Order[]; pagination: Pagination };
  }
);

export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (orderId: number, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/orders/${orderId}`);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return orderId;
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

export const sendMailOrder = createAsyncThunk(
  "order/sendMailOrder",
  async ({ orderId, email }: { orderId: number; email: string }) => {
    const response = await api.post(`/api/orders/send-email/${orderId}`, email);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllOrders.fulfilled,
        (
          state,
          action: PayloadAction<{ data: Order[]; pagination: Pagination }>
        ) => {
          state.loading = false;
          state.orders = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user orders";
      })
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderDetails.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.loading = false;
          state.orderDetails = action.payload;
        }
      )
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch order details";
      })
      .addCase(addOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add order";
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (
          state,
          action: PayloadAction<{ data: Order[]; pagination: Pagination }>
        ) => {
          state.loading = false;
          state.orders = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteOrder.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.orders = state.orders.filter(
            (order) => order.id !== action.payload
          );
        }
      )
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete order";
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const order = state.orders.find(
          (order) => order.id === action.payload.id
        );
        if (order) {
          order.status = action.payload.status as Order["status"];
          state.orderDetails = order as Order;
        }
      })

      .addCase(sendMailOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMailOrder.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;
