import getPost from "@/utils/getPost";
import SinglePostInHomePage from "./SinglePostInHomePage";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const postID = params?.id;
  let id = postID;
  const post = await getPost(id);
  return {
    title: (post?.authorInfo?.name || "Not Found") + " - " + "Ruqyah Forum",
    description:
      post?.post || "Explore a post on Ruqyah Forum. Engage with the community, share your thoughts, and stay informed on spiritual well-being topics.",
    keywords: ["post", "Ruqyah Forum", "community", "spiritual well-being"],
    author: "Ruqyah Support BD",
    url: `https://www.forum.ruqyahbd.org/${id}`,
    image: [...post?.photos, "https://i.ibb.co/wh2mk56/Whats-App-Image-2023-12-16-at-20-32-41.jpg"] || 
    "https://i.ibb.co/wh2mk56/Whats-App-Image-2023-12-16-at-20-32-41.jpg",
};
}

export default async function singlePost({ params }) {
  const postID = params?.id;
  let id = postID;
  const post = await getPost(id);
  if (post?.status === 500 || post?.status === 400 || post?.status === 404 || !post || post?.error) return notFound();
  return (
    <div>
      <SinglePostInHomePage fetchedPost={post} />
    </div>
  );
}
