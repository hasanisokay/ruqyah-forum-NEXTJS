import NavLink from "@/components/shared/NavLink";

const navLinks = [
    {
        path: "/profile",
        title: "Profile Basics"
    },
    {
        path: "/profile/posts",
        title: "My Posts"
    },
    {
        path: "/profile/security",
        title: "Security"
    },
]
const ProfileSidebar = () => {
    return (
        <div>
        <h1 className="text-2xl font-semibold text-center">Profile</h1>
        <ul className="font-semibold flex lg:flex-row flex-col items-center justify-center gap-4">
            {
                navLinks.map(({ path, title }) => <li key={path}>
                    <NavLink exact activeClassName={"text-[#308853]"} href={path}>{title}</NavLink>
                </li>)
            }
        </ul>
    </div>
    );
};

export default ProfileSidebar;