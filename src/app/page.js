import HomePagePosts from "@/components/HomeSecttion/HomePagePosts";
import NewPost from "@/components/HomeSecttion/NewPost";

const HomePage = () => {
  return (
    <div>
      <NewPost/>
      <HomePagePosts />
    </div>
  );
};

export default HomePage;
