
import axios from "axios";
const getUser = async () => {

    try {
        const { data } = await axios.get("/api/auth/me")
        return {
            user: data,
        }
    }
    catch (error) {
        return {
            user: null,
        }
    }
};

export default getUser;