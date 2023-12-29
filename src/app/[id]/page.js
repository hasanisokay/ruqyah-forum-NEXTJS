import SinglePostInHomePage from "./SinglePostInHomePage";
let id = "";
export const metadata = {
  title: "Post - Ruqyah Forum",
  description:
    "Explore a post on Ruqyah Forum. Engage with the community, share your thoughts, and stay informed on spiritual well-being topics.",
  keywords: ["post", "Ruqyah Forum", "community", "spiritual well-being"],
  author: "Ruqyah Support BD",
  image: "https://i.ibb.co/wh2mk56/Whats-App-Image-2023-12-16-at-20-32-41.jpg",
  url: `https://www.forum.ruqyahbd.org/${id}`,
};
const singlePost = ({ params }) => {
  const postID = params.id;
  id = postID;
  return (
    <div>
      <SinglePostInHomePage id={postID} />
    </div>
  );
};

export default singlePost;
