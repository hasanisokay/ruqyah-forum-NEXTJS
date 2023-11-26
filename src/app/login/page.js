import LoadingLoginPage from "./LoadingLoginPage";
import LoginForm from "./LoginForm";

export const metadata = {
    title: "Login - Ruqyah Forum",
    description: "Login for Forum by Ruqyah Support BD",
  };
const page = () => {
    return (
        <div>
            <LoginForm />
        </div>
    );
};

export default page;