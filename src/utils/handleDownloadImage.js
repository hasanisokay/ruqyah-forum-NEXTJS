import toast from "react-hot-toast";

const handleDownloadImage = async (imageUrl) => {
  const downloading = toast.loading("Downloading...");
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = blobUrl;
    const fileExtension = imageUrl.split(".").pop().toLowerCase();
    const timestamp = new Date().getTime();
    downloadLink.download = `ruqyahbd_${timestamp}.${fileExtension}`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(blobUrl);
    toast.success("Downloaded");
  } catch (error) {
    toast.error("Counld not download. Try again later.");
    console.error("Error downloading image:", error);
  } finally {
    toast.dismiss(downloading);
  }
};

export default handleDownloadImage;
