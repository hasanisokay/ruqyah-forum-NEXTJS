import ProfileSidebar from "./ProfileSidebar";

const layout = ({ children }) => {
  return <div>
    <ProfileSidebar />
    {children}
    </div>;
};

export default layout;
