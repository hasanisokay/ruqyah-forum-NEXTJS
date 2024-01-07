import Profile from "./Profile";

export const metadata = {
  title: "Profile | Ruqyah Forum",
  description:
    "Explore and manage your profile on Ruqyah Forum. Engage with the community and stay connected.",
  keywords: [
    "profile",
    "Ruqyah Forum",
    "community",
    "user account",
    "ruqyahbd",
  ],
  author: "Ruqyah Support BD",
  image: "https://i.ibb.co/wh2mk56/Whats-App-Image-2023-12-16-at-20-32-41.jpg",
  url: "https://forum.ruqyahbd.org/profile",
};
const ProfilePage = () => {
  return (
    <div>
      <Profile />
    </div>
  );
};

export default ProfilePage;
