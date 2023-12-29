
import Notifications from './Notifications';

export const metadata = {
    title: "Notifications | Ruqyah Forum",
    description: "Stay informed with the latest notifications from Ruqyah Forum. Keep up-to-date with community activities and updates.",
    keywords: ["notifications", "Ruqyah Forum", "community", "updates", "ruqyahbd"],
    author: "Ruqyah Support BD", 
    image:"https://i.ibb.co/wh2mk56/Whats-App-Image-2023-12-16-at-20-32-41.jpg",
    url: "https://www.forum.ruqyahbd.org/notifications",
  };

const notificationsPage = () => {
    return (
        <div>
            <Notifications/>
        </div>
    );
};

export default notificationsPage;