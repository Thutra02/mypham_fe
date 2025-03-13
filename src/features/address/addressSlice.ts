import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { Address } from "../../types/address.types";
import { AxiosError } from "axios";

interface AddressState {
  addresses: Address[];
  address: Address | null;
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  address: null,
  loading: false,
  error: null,
};

export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async () => {
    const response = await api.get("/api/address");
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Address[];
  }
);

export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (newAddress: Address, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/address", newAddress);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Address;
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

export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async (updatedAddress: Address, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/address/${updatedAddress.id}`,
        updatedAddress
      );
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Address;
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

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (addressId: number, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/address/${addressId}`);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return addressId;
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

export const fetchAddressById = createAsyncThunk(
  "address/fetchAddressById",
  async (addressId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/address/${addressId}`);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Address;
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

export const setDefaultAddress = createAsyncThunk(
  "address/setDefaultAddress",
  async (addressId: number, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/address/${addressId}/default`);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return addressId;
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

export const getAddressDefault = createAsyncThunk(
  "address/getAddressDefault",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/address/default`);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Address;
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

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAddresses.fulfilled,
        (state, action: PayloadAction<Address[]>) => {
          state.loading = false;
          state.addresses = action.payload;
        }
      )
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch addresses";
      })
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addAddress.fulfilled,
        (state, action: PayloadAction<Address>) => {
          state.loading = false;
          state.addresses.push(action.payload);
        }
      )
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add address";
      })
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateAddress.fulfilled,
        (state, action: PayloadAction<Address>) => {
          state.loading = false;
          const index = state.addresses.findIndex(
            (address) => address.id === action.payload.id
          );
          if (index !== -1) {
            state.addresses[index] = action.payload;
          }
        }
      )
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update address";
      })
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteAddress.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.addresses = state.addresses.filter(
            (address) => address.id !== action.payload
          );
        }
      )
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete address";
      })
      .addCase(fetchAddressById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAddressById.fulfilled,
        (state, action: PayloadAction<Address>) => {
          state.loading = false;
          state.address = action.payload;
        }
      )
      .addCase(fetchAddressById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch address";
      })
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        setDefaultAddress.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          const index = state.addresses.findIndex(
            (address) => address.id === action.payload
          );
          if (index !== -1) {
            state.addresses[index].default = true;
            // các địa chỉ còn lại phải set default = false
            state.addresses.forEach((address) => {
              if (address.id !== action.payload) {
                address.default = false;
              }
            });
          }
        }
      )
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to set default address";
      })
      .addCase(getAddressDefault.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAddressDefault.fulfilled,
        (state, action: PayloadAction<Address>) => {
          state.loading = false;
          state.address = action.payload;
        }
      )
      .addCase(getAddressDefault.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to get default address";
      });
  },
});

export default addressSlice.reducer;
