
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await axios.get('/category/get-all-category');
  return response.data;
});

export const createCategory = createAsyncThunk('categories/createCategory', async (categoryData) => {
  const response = await axios.post('/category/create-category', categoryData);
  return response.data;
});

export const createSubcategory = createAsyncThunk('categories/createSubcategory', async ({ categoryId, subcategoryData }) => {
  const response = await axios.post(`/subcategory/${categoryId}/create-sub-category`, subcategoryData);
  return response.data;
});

export const updateCategory = createAsyncThunk('categories/updateCategory', async ({ categoryId, updateData }) => {
  const response = await axios.put(`/category/updatecategory/${categoryId}`, updateData);
  return response.data;
});

const initialState = {
  categories: [],
  loading: false,
  error: null,
  newlyCreatedCategoryId: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    clearNewlyCreatedCategoryId: (state) => {
      state.newlyCreatedCategoryId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push({ ...action.payload, subCategories: [] }); // Ensure subCategories is initialized as an array
        state.newlyCreatedCategoryId = action.payload._id;
        state.loading = false;
      })
      .addCase(createSubcategory.fulfilled, (state, action) => {
        const category = state.categories.find(cat => cat._id === action.payload.category_id);
        if (category) {
          if (!category.subCategories) {
            category.subCategories = [];
          }
          category.subCategories.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat._id === action.payload._id);
        if (index !== -1) {
          // Update only the category name and description
          state.categories[index] = {
            ...state.categories[index],
            category_name: action.payload.category_name,
            category_description: action.payload.category_description
          };
        }
        state.loading = false;
      });
  },
});

export const { startLoading, stopLoading, clearNewlyCreatedCategoryId } = categoriesSlice.actions;

export default categoriesSlice.reducer;
