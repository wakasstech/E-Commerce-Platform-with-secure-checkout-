import { addLecture } from "../../globalStore/Slices/CoursesSlice";
import { addLectures, editLectures } from "../../globalStore/Slices/LecturesSlice";
import axios from "../../utils/axios";

export const createLecture = async (payload, dispatch) => {
  

  try {
    //   dispatch(startLoading());

    const response = await axios.post(`lecture/create-lecture`, payload);

    if (response.status === 201) {
       
        console.log(response.data, 'success api create course')
      const res = response.data;
     
      dispatch(addLectures(res));
      return res;
    } else {
      // Handle non-200 status
    }
  } catch (error) {
    // Handle network error
    console.error("Network error", error);
  } finally {
    //   dispatch(stopLoading());
  }
};

export const updateLecture = async (payload,lectureId, dispatch) => {
  try {
    //   dispatch(startLoading());

    const response = await axios.put(`/lecture/${lectureId}`, payload);

    if (response.status === 200) {
      
        console.log(response.data, 'success api update course')
      const res = response.data;
     
      dispatch(editLectures(res));
      return res;
    } else {
      // Handle non-200 status
    }
  } catch (error) {
    // Handle network error
    console.error("Network error", error);
  } finally {
    //   dispatch(stopLoading());
  }
  };
  
