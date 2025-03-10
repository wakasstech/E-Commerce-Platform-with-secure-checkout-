import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const fetchCourses = createAsyncThunk('courses/fetchCourses', async ({ searchCoursesId, type }) => {
  const response = await axios.get(`/course/getall-course?${type}Id=${searchCoursesId}`);
  return response.data;
});
export const fetchFilterCourses = createAsyncThunk('courses/fetchFilterCourses', async (queryString) => {
  const response = await axios.get(`/search/subcategoryCourseSearch?${queryString}`);
  console.log(response.data)
  return response.data;
});


export const fetchEnrollmentInfo = createAsyncThunk('courses/fetchEnrollmentInfo', async ({courseId}) => {
  const response = await axios.get(`/enrollment/get-teachers-and-student-of-course?courseId=${courseId}`);
  console.log(response.data)
  return response.data;
});

const initialState = {
  courses: [],
  loading: false,
  error: null,
  filters: {},
  enrollStudents: [],
  enrollTeachers: []
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCourses(state) {
      state.courses = [];
      state.filters = {};
      state.error = null;
    },
    setFilters(state, action) {
      state.filters = action.payload;
    },
    addCourse(state, action) {
      state.courses.push({ ...action.payload });
    },
    editCourse(state, action) {
      const updatedCourse = action.payload;
      const index = state?.courses.findIndex(course => course._id === updatedCourse._id);
      if (index !== -1) {
        state.courses[index] = updatedCourse;
      }
    },
    addEnrollment(state, action) {
      const {...enrollmentData } = action.payload;
      if (enrollmentData?.role === "student") {
        const studentExists = state.enrollStudents.some(student => student._id === enrollmentData._id);
        if (!studentExists) {
          state.enrollStudents.push(enrollmentData);
        }
      } else if (enrollmentData?.role === "teacher") {
        const teacherExists = state.enrollTeachers.some(teacher => teacher._id === enrollmentData._id);
        if (!teacherExists) {
          state.enrollTeachers.push(enrollmentData);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        
        state.courses = [];
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.loading = false;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFilterCourses.pending, (state) => {
        state.loading = true;
        state.courses = [];
        state.error = null;
      })
      .addCase(fetchFilterCourses.fulfilled, (state, action) => {
        state.courses = action.payload.courses;
        state.loading = false;
      })
      .addCase(fetchFilterCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
        // get teachers and students enrollment
      .addCase(fetchEnrollmentInfo.pending, (state) => {
        state.loading = true;
       
      })
      .addCase(fetchEnrollmentInfo.fulfilled, (state, action) => {
      
        state.enrollStudents = action.payload.students;
        state.enrollTeachers = action.payload.teachers;
        state.loading = false;
      })
      .addCase(fetchEnrollmentInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });


      
  },
});

export const { clearCourses, setFilters, addCourse, editCourse, addEnrollment  } = coursesSlice.actions;

export default coursesSlice.reducer;



