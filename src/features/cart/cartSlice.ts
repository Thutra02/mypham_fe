import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../../api/api";
import { Cart, CartItemRequest } from "../../types/cart.types";

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.status === "error") {
        console.log(response.data.message);
        throw new Error(response.data.message);
      }
      return response.data.data as Cart;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        axiosError.response?.data.message || "An error occurred"
      );
    }
  }
);

export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async (newCartItem: CartItemRequest, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/cart/add", newCartItem);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Cart;
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

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (updatedCartItem: CartItemRequest) => {
    const response = await api.put(
      `/api/cart/update/${updatedCartItem.productId}?quantity=${updatedCartItem.quantity}`,
      updatedCartItem
    );
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Cart;
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (cartItemId: number, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/cart/remove/${cartItemId}`);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return cartItemId;
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

export const clearCart = createAsyncThunk("cart/clearCart", async () => {
  const response = await api.delete("/api/cart");
  if (response.data.status === "error") {
    throw new Error(response.data.message);
  }
});

export const fetchUrlMomo = createAsyncThunk(
  "cart/fetchUrlMomo",
  async (data: { orderId: string; total: number }) => {
    const response = await api.post("/api/momo", data);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data as string;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // clearCarrt
    clearCartNew: (state) => {
      state.cart = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      })

      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCartItem.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        state.cart!.total = state.cart!.cartItems.reduce(
          (total, item) => total + item.unitPrice * item.quantity,
          0
        );
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add cart item";
      })

      .addCase(
        updateCartItem.fulfilled,
        (state, action: PayloadAction<Cart>) => {
          state.loading = false;
          state.cart = action.payload;
        }
      )
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update cart item";
      })

      .addCase(
        deleteCartItem.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.cart!.cartItems = state.cart!.cartItems.filter(
            (item) => item.id !== action.payload
          );
          state.cart!.total = state.cart!.cartItems.reduce(
            (total, item) => total + item.unitPrice * item.quantity,
            0
          );
        }
      )
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete cart item";
      })
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.cart = null;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to clear cart";
      });
  },
});

export const { clearCartNew } = cartSlice.actions;

export default cartSlice.reducer;
