import axios from "axios";
import toast from "react-hot-toast";

const handleDeleteComment = async (postID, commentID) => {
  const { data } = await axios.post("/api/posts/deletecomment", {
    commentID,
    postID,
  });
  if (data.status === 200) {
    toast.success(data?.message);
    return true;
  } else {
    toast.error(data?.message);
    return false;
  }
};

export default handleDeleteComment;
