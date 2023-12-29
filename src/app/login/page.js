import LoadingLoginPage from "./LoadingLoginPage";
import LoginForm from "./LoginForm";

export const metadata = {
    title: "Login - Ruqyah Forum",
    description: "Login to the Ruqyah Forum by Ruqyah Support BD. Access your account, engage with the community, and participate in discussions on spiritual well-being.",
    keywords: ["login", "Ruqyah Forum", "community", "spiritual well-being"],
    author: "Ruqyah Support BD",
    image: "https://i.ibb.co/wh2mk56/Whats-App-Image-2023-12-16-at-20-32-41.jpg",
    url: "https://www.forum.ruqyahbd.org/login",
  };

const page = () => {
    return (
        <div>
            <LoginForm />
        </div>
    );
};

export default page;