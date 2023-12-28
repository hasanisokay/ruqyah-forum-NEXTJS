const convertVideoToBase64 = (videoFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(videoFile);

    reader.onloadend = () => {
      const base64Video = reader.result.split(",")[1];
      resolve(base64Video);
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
};
export default convertVideoToBase64;
