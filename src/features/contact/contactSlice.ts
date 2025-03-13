import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../../api/api";
import { Contact, ContactListResponse } from "../../types/contact.types";
import { Pagination } from "../../types/pagination.types";

interface ContactState {
  contacts: Contact[];
  contact: Contact | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: ContactState = {
  contacts: [],
  contact: null,
  loading: false,
  error: null,
  pagination: null,
};

export const fetchContacts = createAsyncThunk(
  "contact/fetchContacts",
  async ({
    page = 1,
    search = "",
    size,
  }: {
    page?: number;
    search?: string;
    size?: number;
  }) => {
    const response = await api.get(
      `/api/contact?page=${page - 1}&search=${search}&size=${size}`
    );
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data as ContactListResponse;
  }
);

export const addContact = createAsyncThunk(
  "contact/addContact",
  async (newContact: Contact, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/contact", newContact);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Contact;
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

export const updateContact = createAsyncThunk(
  "contact/updateContact",
  async (updatedContact: Contact, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/contact/${updatedContact.id}`,
        updatedContact
      );
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Contact;
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

export const deleteContact = createAsyncThunk(
  "contact/deleteContact",
  async (contactId: number, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/contact/${contactId}`);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return contactId;
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

export const fetchContactById = createAsyncThunk(
  "contact/fetchContactById",
  async (contactId: number) => {
    const response = await api.get(`/api/contact/${contactId}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Contact;
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchContacts.fulfilled,
        (state, action: PayloadAction<ContactListResponse>) => {
          state.loading = false;
          state.contacts = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch contacts";
      })
      .addCase(addContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addContact.fulfilled,
        (state, action: PayloadAction<Contact>) => {
          state.loading = false;
          state.contacts.push(action.payload);
        }
      )
      .addCase(addContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add contact";
      })
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateContact.fulfilled,
        (state, action: PayloadAction<Contact>) => {
          state.loading = false;
          const index = state.contacts.findIndex(
            (contact) => contact.id === action.payload.id
          );
          if (index !== -1) {
            state.contacts[index] = action.payload;
          }
        }
      )
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update contact";
      })
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteContact.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.contacts = state.contacts.filter(
            (contact) => contact.id !== action.payload
          );
        }
      )
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchContactById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchContactById.fulfilled,
        (state, action: PayloadAction<Contact>) => {
          state.loading = false;
          state.contact = action.payload;
        }
      )
      .addCase(fetchContactById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch contact";
      });
  },
});

export default contactSlice.reducer;
