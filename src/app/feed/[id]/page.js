import loadPostData from "@/utils/loadPostData";

export const generateMetaData = async ({params}) => {
  const postID = params.id;
  const post = await loadPostData(postID);
  return {
    title: post.title
  };
}

const SinglePost = async ({ params }) => {
  const postID = params.id;


  const post = await loadPostData(postID);
  return (
    <div className="bg-blue-400 my-10 py-2">
      <p>{post.id}</p>
      <p>{post.title}</p>
    </div>
  );
};

export default SinglePost;
