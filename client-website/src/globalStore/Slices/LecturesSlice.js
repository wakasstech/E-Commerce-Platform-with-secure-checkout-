import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const fetchLectures = createAsyncThunk('categories/fetchLectures', async ({ courseId}) => {
  const response = await axios.get(`lecture/getAll-lecture-of-course?courseId=${courseId}`);
  return response.data;
});

const initialState = {
  lectures: [],
  loading: false,
  error: null,
};

const lecturesSlice = createSlice({
  name: 'lectures',
  initialState,
  reducers: {
    clearLectures(state) {
      state.lectures = [];
      state.error = null;
    },
    addLectures(state, action){
      state.lectures.push({ ...action.payload }); 

      // state.loading = false;
    },
    editLectures(state, action){
      const updateLecture = action.payload;
      const index = state?.lectures.findIndex(lecture => lecture._id === updateLecture._id);
      if (index !== -1) {
        state.lectures[index] = updateLecture;
      }    
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLectures.pending, (state) => {
        state.loading = true;
        state.lectures = [];
        state.error = null;
      })
      .addCase(fetchLectures.fulfilled, (state, action) => {
        state.lectures = action.payload;
        state.loading = false;
      })
      .addCase(fetchLectures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearLectures, addLectures, editLectures } = lecturesSlice.actions;

export default lecturesSlice.reducer;
