import axios from "axios";
import toast from "react-hot-toast";

const handleDeletePost = async (id, isAuthorized) => {
  if (!isAuthorized) return;
  const dataToSend = {
    postID: id,
    action: "delete",
  };
  const { data } = await axios.post("/api/posts/changestatus", dataToSend);
  if (data.status === 200) {
    toast.success(data?.message);
  } else {
    toast.error(data?.message);
  }
};
export default handleDeletePost;
