import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/AuthSlice";
import videosReducer from "./Slices/videoSlice";
import categoriesReducer from "./Slices/categoriesSlice";
import coursesReducer from "./Slices/CoursesSlice";
import lecturesReducer from "./Slices/LecturesSlice";

const Store = configureStore({
  reducer: {
    
    auth: authReducer,
    categories: categoriesReducer,
    courses: coursesReducer,
    lectures: lecturesReducer,
    videos: videosReducer,
  
  },
});
export default Store;
