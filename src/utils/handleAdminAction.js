import axios from "axios";
import toast from "react-hot-toast";

const handleAdminAction = async (username, action, adminUsername) => {
    if(!adminUsername){
        return toast.error("Unauthorized")
    }
    const { data } = await axios.post("/api/admin/changeuserrole", { username, action, actionBy: adminUsername })
    if(data.status===200){
        toast.success(data.message)
    }
    else{
        toast.error(data.message)
    }
}
export default handleAdminAction;