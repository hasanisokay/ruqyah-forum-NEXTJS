
import loadPostData from "@/utils/loadPostData";
import Link from "next/link";

export const metadata = () => {
    return {
      title: "Posts | Ruqyah Forum",
      description: "Forum by Ruqyah Support BD",
    };
  }
  

const PostPage =  async () => {

const posts = await loadPostData()
  return <div>
{
    posts.map((post, index)=> <div key={post.id} className="bg-blue-400 my-10 py-2">
        <p>{post.id}</p>
        <p>{post.title}</p>
        <Link href={`/posts/${post.id}`}>{post.id}</Link>
    </div> )
}
  </div>;
};

export default PostPage;
