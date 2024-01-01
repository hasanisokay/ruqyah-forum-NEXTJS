import Stats from "@/components/stats/Stats";

export const metadata = {
  title: "Stats - Ruqyah Forum",
  description:
    "Learn more about Ruqyah Forum, a community platform supported by Ruqyah Support BD. Discover our mission, values, and how you can actively participate in the forum.",
  keywords: [
    "about us",
    "stats",
    "statistics",
    "Ruqyah Forum",
    "community",
    "mission",
    "values",
  ],
  author: "Ruqyah Support BD",
  image: "https://i.ibb.co/wh2mk56/Whats-App-Image-2023-12-16-at-20-32-41.jpg",
  url: "https://www.forum.ruqyahbd.org/stats",
};

const statsPage = () => {
  return (
    <div>
      <Stats />
    </div>
  );
};

export default statsPage;
