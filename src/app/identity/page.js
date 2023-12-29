import ForgetPass from './ForgetPass';

export const metadata = {
  title: "Forgot Password - Ruqyah Forum",
  description: "Recover your account password for Ruqyah Forum by Ruqyah Support BD. Follow the steps to reset your password and regain access to your account.",
  keywords: ["forgot password", "password recovery", "Ruqyah Forum", "account"],
  author: "Ruqyah Support BD",
  image: "https://i.ibb.co/wh2mk56/Whats-App-Image-2023-12-16-at-20-32-41.jpg",
  url: "https://www.forum.ruqyahbd.org/forgot-password",
};
const page = () => {
    return (
        <div>
          <ForgetPass />  
        </div>
    );
};

export default page;