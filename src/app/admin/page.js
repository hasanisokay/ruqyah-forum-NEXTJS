import Dashboard from "./Dashboard";

export const metadata = {
  title: "Admin - Ruqyah Forum",
  description: "Manage and oversee the Ruqyah Forum as an administrator. Access powerful tools, monitor community activities, and ensure the smooth functioning of the forum.",
  keywords: ["admin", "Ruqyah Forum", "community management", "administrator"],
  author: "Ruqyah Support BD",
  image: "https://i.ibb.co/wh2mk56/Whats-App-Image-2023-12-16-at-20-32-41.jpg",
  url: "https://www.forum.ruqyahbd.org/admin",
};
const page = () => {
  return <div>
    <Dashboard/>
  </div>;
};

export default page;
