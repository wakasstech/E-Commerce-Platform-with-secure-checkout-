import { addCourse, editCourse } from "../../globalStore/Slices/CoursesSlice";
import axios from "../../utils/axios";

export const createCourse = async (payload, dispatch) => {
  try {
    //   dispatch(startLoading());

    const response = await axios.post(`course/create-course`, payload);

    if (response.status === 201) {
      console.log(response.data, "success api create course");
      const res = response.data;

      dispatch(addCourse(res));
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

export const updateCourse = async (payload, courseId, dispatch) => {
  try {
    //   dispatch(startLoading());

    const response = await axios.put(
      `/course/${courseId}/update-course`,
      payload
    );

    if (response.status === 200) {
      console.log(response.data, "success api update course");
      const res = response.data;

      dispatch(editCourse(res));
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

export const courseEnrollment = async (payload, dispatch, enrollTag) => {

  try {
    //   dispatch(startLoading());

    const endpoint =
    enrollTag === "enroll"
      ? "enrollment/student-enrollment--in-course"
      : "enrollment/teacher-assigned-to-course";

    const response = await axios.post(
      endpoint,
      payload
    );

    if (response.status === 201) {
      console.log(response.data, "success api create course");
      const res = response.data;

      // dispatch(addCourse(res));
      return res;
    } else {
      // Handle non-200 status
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw error.response.data.message; // Throw the error message
    }
    // Handle network error
    console.error("Network error", error);
    // throw error; // Re-throw the error for other types of network errors
  } finally {
    //   dispatch(stopLoading());
  }
};
