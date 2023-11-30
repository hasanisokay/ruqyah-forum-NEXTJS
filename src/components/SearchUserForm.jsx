import React, { useState } from 'react';
import toast from 'react-hot-toast';

const SearchUserForm = ({ onSearch }) => {
    const [username, setUsername] = useState('');

    const handleInputChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === "") {
            return toast.error("Enter username to get details")
        }
        onSearch(username);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 cardinhome">
            <label htmlFor="username" className="block font-semibold text-center">
                Search for user.
            </label>
            <div className="my-2 rounded-md shadow-sm  flex items-center justify-center">
                <input
                    type="text"
                    id="username"
                    className="input input-bordered "
                    placeholder="Enter username"
                    value={username}
                    onChange={handleInputChange}
                />
            </div>
            <div className='text-center'>
                <button
                    type="submit"
                    className="forum-btn1 bg-[#308853]"
                >
                    Search
                </button>
            </div>
        </form>
    );
};
export default SearchUserForm;