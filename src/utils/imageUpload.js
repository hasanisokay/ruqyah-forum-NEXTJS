import axios from "axios";

const imageUpload = async (imageFile, config) => {
  const apiKey = process.env.NEXT_PUBLIC_IMGTOKEN;
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      formData,
      config
    );

    if (response.data && response.data.data && response.data.data.url) {
      return response.data.data.url;
    } else {
      throw new Error("Failed to upload image to ImgBB");
    }
  } catch (error) {
    console.error("Error uploading image to ImgBB:", error.message);
    throw error;
  }
};

export default imageUpload;
