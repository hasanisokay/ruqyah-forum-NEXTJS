import AdminsStat from "./AdminsStat";
import DeveloperContact from "./DeveloperContact";
import OnlineUsersCounter from "./OnlineUsersCounter";
import PostStat from "./PostStat";


const Stats = () => {
    return (
        <div className="mb-10">
            <OnlineUsersCounter />
            <PostStat />
            <div className="bg-[#fffef9] shadow-xl dark:bg-[#242526] cardinhome py-4 min-h-[300px]  ">
                <AdminsStat />
            </div>
            <DeveloperContact />
        </div>
    );
};

export default Stats;