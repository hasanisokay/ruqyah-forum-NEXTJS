import Sidebar from "./Sidebar";

const layout = ({children}) => {
    return (
        <div className="">
            <Sidebar />
            {children}
        </div>
    );
};

export default layout;