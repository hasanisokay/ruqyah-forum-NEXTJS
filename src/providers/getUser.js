
const getUser = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/auth/me")
        const data = await response.json();
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