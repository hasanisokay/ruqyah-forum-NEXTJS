import ProfileSidebar from "./ProfileSidebar";

const layout = ({ children }) => {
  return <div>
    <div className="mb-4">
        <ProfileSidebar />
    </div>
    {children}
    </div>;
};

export default layout;
