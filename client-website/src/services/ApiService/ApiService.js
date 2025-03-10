import {
  startLoading,
  stopLoading,
  uploadVideo,
} from "../../globalStore/Slices/videoSlice";
import axios from "../../utils/axios";

export const uploadVideoAndContent = async (videoData, dispatch) => {
  const formData = new FormData();

  // Append
  if (videoData) {
    formData.append("video", videoData?.videoFile);
    formData.append("thumbnail", videoData?.thumbnail);
    formData.append("title", videoData?.title);
    formData.append("desc", videoData?.description);
    formData.append("lecture_id", videoData?.lectureId);
  }

  try {
    dispatch(startLoading());

    const response = await axios.post(`video/uploadfile`, formData);

    if (response.status === 200) {
      const res = response.data;
      dispatch(uploadVideo(res?.data?.video));
      return res; // Return the data after successful response
    } else {
      // Handle non-200 status
    }
  } catch (error) {
    // Handle network error
    console.error("Network error", error);
  } finally {
    dispatch(stopLoading());
  }
};
