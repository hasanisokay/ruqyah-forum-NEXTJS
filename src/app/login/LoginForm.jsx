'use client'
import AuthContext from '@/contexts/AuthContext';
import useTheme from '@/hooks/useTheme';
import createJWT from '@/utils/createJWT';
import { useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import LoadingLoginPage from './LoadingLoginPage';

const LoginForm = () => {
    const { signIn, fetchedUser, setFetchedUser } = useContext(AuthContext);
    const [disableForm, setDisableForm] = useState(false);
    const search = useSearchParams();
    const from = search.get("redirectUrl") || "/";
    const router = useRouter();
    const { replace, refresh, push } = router;
    const { theme } = useTheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const inputClasses = `w-full p-2 border rounded-md focus:outline-none focus:border-blue-500 ${theme === 'dark' ? 'bg-black' : 'bg-white'
        } `;
    const [errors, setErrors] = useState({
        username: '',
        password: '',
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({
            username: '',
            password: '',
        });
        if (!username) {
            setErrors((prevErrors) => ({ ...prevErrors, username: 'Username is required' }));
            return
        }
        if (!password) {
            setErrors((prevErrors) => ({ ...prevErrors, password: 'Password is required' }));
            return
        }
        try {
            setDisableForm(true)
            const toastId = toast.loading("Loading...");
            const res = await signIn(username, password)
            if (res.status === 404) {
                toast.dismiss(toastId);
                toast.error(res.message)
            }
            else {
                const { username, email, isAdmin} = res;
                await createJWT({ username, email, isAdmin })
                setFetchedUser(res)
                toast.dismiss(toastId);
                toast.success("Success");
            }
            setDisableForm(false)

        } catch (error) {
            console.error('Error while login: ', error.message);
            return false;
        }
    };

    useEffect(() => {
        if (fetchedUser) {
            startTransition(() => {
                refresh()
                push(from);
            });
        }
    }, [fetchedUser, from, push, refresh,]);

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className={`lg:w-[40vw] md:w-[80vw] w-[90vw] mx-auto mt-4 p-4 shadow-md rounded-md ${theme === 'dark' ? 'bg-white' : 'bg-[#f0f1f3]'} ${disableForm ? "opacity-50" : "opacity-100"}`}
            >
                <h1 className='text-xl text-center dark:text-black font-semibold'>Login</h1>
                <label htmlFor="username" className="block mt-4 mb-2 text-gray-600">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    disabled={disableForm}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`${inputClasses}`}
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}


                <label htmlFor="password" className="block mt-4 mb-2 text-gray-600">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    disabled={disableForm}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClasses}`}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                <button
                    type="submit" disabled={disableForm}
                    className={`mt-6 w-full text-white p-2 rounded-md ${disableForm ? "bg-slate-400" : "bg-blue-500 hover:bg-blue-600"}`}
                >
                    Log In
                </button>
                <div className='my-2 dark:text-black'>
                    <p className='text-sm'>Don't have an account? Please <button onClick={()=>router.push("/signup")} title='goto signup' className='text-blue-600 italic'>Sign Up</button>.</p>
                    <p className='text-sm mt-2'>Forgotten password? <button onClick={()=>router.push("/identity")} title='goto reset password' className='text-blue-600 italic'>Reset Password</button>.</p>
                </div>
            </form>
        </>
    );
};

export default LoginForm;
