import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

// Async thunks for different API calls
export const fetchVideos = createAsyncThunk("video/fetchVideos", async ({ lectureId}) => {
  const response = await axios.get(`lecture/${lectureId}`);
  return response.data;
});

const initialState = {
  userVideos: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    uploadVideo: (state, action) => {
      if (state.userVideos) {
        state.userVideos?.videos.push(action.payload);
      }
    },
    // setuserVideos: (state, action) => {
    //   state.userVideos = action.payload;
    // },
    // setError: (state, action) => {
    //   state.error = action.payload;
    // },
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.userVideos = action.payload;
        state.loading = false;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  uploadVideo,
  // setuserVideos,
  // setError,
  startLoading,
  stopLoading,
} = userSlice.actions;

export default userSlice.reducer;
