import PublicNotice from "./PublicNotice";

export const metadata = {
    title: "Public Notice - Ruqyah Forum",
    description: "Stay informed with the latest public notices from Ruqyah Forum. Find important updates, announcements, and community news to enhance your participation in the forum.",
    keywords: ["notice", "Ruqyah Forum", "community", "spiritual well-being"],
    author: "Ruqyah Support BD",
    image: "https://i.ibb.co/wh2mk56/Whats-App-Image-2023-12-16-at-20-32-41.jpg",
    url: "https://www.forum.ruqyahbd.org/notice",
  };

  const NoticePage = () => {
    
    return (
        <div>
           <PublicNotice/>
        </div>
    );
};

export default NoticePage;