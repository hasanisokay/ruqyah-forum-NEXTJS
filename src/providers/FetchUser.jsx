import { useState } from "react";

const FetchUser = async () => {
    const [loading, setLoading] = useState(true);
        setLoading(true);
        const { user } = await getUser();
        if (user.status === 401) {

            setFetchedUser(null)
            setLoading(false)
            return;
        }
        setLoading(false);
        return {loading, user};
};

export default FetchUser;