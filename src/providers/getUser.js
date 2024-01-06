import axios from "axios";
const getUser = async () => {
    try {
        const { data } = await axios.get("http://localhost:3000/api/auth/me")
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