import Sidebar from "./Sidebar";

const layout = ({children}) => {
    return (
        <div>
            <Sidebar />
            {children}
        </div>
    );
};

export default layout;