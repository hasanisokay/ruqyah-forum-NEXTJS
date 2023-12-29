import SignUpForm from "./SignUpForm";

export const metadata = {
  title: "Signup - Ruqyah Forum",
  description: "Join Ruqyah Forum to access exclusive content and community discussions.",
  keywords: ["signup", "registration", "Ruqyah Forum", "community", "ruqyahbd"],
  author: "Ruqyah Support BD", 
  image:"https://i.ibb.co/wh2mk56/Whats-App-Image-2023-12-16-at-20-32-41.jpg",
  url: "https://www.forum.ruqyahbd.org/signup", 
};
const SignupPage = () => {
  return (
    <div>
      <SignUpForm />
    </div>
  );
};

export default SignupPage;