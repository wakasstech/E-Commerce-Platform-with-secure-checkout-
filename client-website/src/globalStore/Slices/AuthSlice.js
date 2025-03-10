import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

// Thunks
export const register = createAsyncThunk(
  "auth/register",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post("/user/create", user); // await the API call
      return response.data; // Return the data correctly
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post("/user/userlogin", user); // Correct the API call
      return response.data; // Return the data correctly
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await axios.get('/user/getuser');
  return response.data;
});

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      // For SignUp
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Adjust the state update
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // For Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user; // Adjust the state update
        state.token = action.payload.data.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.data.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // For initialize User
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data; // Assuming payload structure matches the fetched user data
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});


export const { setAuthState, logout } = authSlice.actions;

export default authSlice.reducer;
