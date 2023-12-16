import axios from "axios";
import toast from "react-hot-toast";

const handleDeleteReply = async (postID, commentID, replyID) => {
  const { data } = await axios.post("/api/posts/deletecomment", {
    postID,
    commentID,
    replyID,
  });
  if (data?.status === 200) {
    toast.success(data?.message);
    return true;
  } else {
    toast.error(data?.message);
    return false;
  }
};

export default handleDeleteReply;
