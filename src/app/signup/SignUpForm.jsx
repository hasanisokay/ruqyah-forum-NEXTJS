'use client'
import AuthContext from '@/contexts/AuthContext';
import useTheme from '@/hooks/useTheme';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import LoadingSignUpPage from './LoadingSignUpPage';
import createJWT from '@/utils/createJWT';

const SignUpForm = () => {

  const { fetchedUser, setFetchedUser, signIn } = useContext(AuthContext)
  const search = useSearchParams();
  const from = search.get("redirectUrl") || "/";

  const [isPending, startTransition] = useTransition()
  const { replace, refresh, push } = useRouter();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [gender, setGender] = useState('');
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    retypePassword: '',
    gender: '',
  });
  useEffect(() => {
    if (fetchedUser) {
      startTransition(() => {
        refresh()
        push(from);
      });
    }
  }, [fetchedUser, from, push, refresh,]);
  function formatDate() {
    const options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZoneName: 'short',
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date());
    return formattedDate;
  }

  const checkUsernameAvailability = async (newUsername) => {
    try {
      const response = await fetch(`api/auth/username?username=${newUsername}`);
      const data = await response.json();
      return data.available; // Assuming your API returns an object with a boolean property 'available'
    } catch (error) {
      console.error('Error checking username availability:', error.message);
      return false;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      retypePassword: '',
      gender: '',
    });

    // Basic validation
    if (!name || name.length < 3) {
      setErrors((prevErrors) => ({ ...prevErrors, name: 'Name is required' }));
      return
    }
    if (name.length < 3) {
      setErrors((prevErrors) => ({ ...prevErrors, name: 'Name length should be at least 3' }));
      return
    }

    if (!username) {
      setErrors((prevErrors) => ({ ...prevErrors, username: 'Username is required' }));
      return
    }
    if (!isUsernameAvailable) {
      return
    }


    if (!password) {
      setErrors((prevErrors) => ({ ...prevErrors, password: 'Password is required' }));
      return
    }

    if (password !== retypePassword) {
      setErrors((prevErrors) => ({ ...prevErrors, retypePassword: 'Passwords do not match' }));
      return
    }

    if (!gender) {
      setErrors((prevErrors) => ({ ...prevErrors, gender: 'Gender is required' }));
      return
    }


    try {
      const toastId = toast.loading("Loading...");
      await fetch(`api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, email, phone, password, gender, photoURL:"", joined: formatDate() }),
      });
      const res = await signIn(username, password)
      if (res.status===404) {
          toast.dismiss(toastId);
          toast.error(res.message)
      }
      else {
          const { username, email, name, gender, phone, joined, isAdmin, photoURL } = res;
          await createJWT({ username, email, name, gender, phone, joined, isAdmin, photoURL })
          setFetchedUser(res)
          toast.dismiss(toastId);
          toast.success("Success");
      }

    } catch (error) {
      console.error('Error while sign up: ', error.message);
      return false;
    }
  };

  const inputClasses = `w-full p-2 border rounded-md focus:outline-none focus:border-blue-500 ${theme === 'dark' ? 'bg-black' : 'bg-white'
    } `;
  useEffect(() => {
    const checkAvailability = async () => {
      if (username?.length > 3) {
        setUsernameChecking(true)
        const available = await checkUsernameAvailability(username);
        setUsernameChecking(false);
        setIsUsernameAvailable(available);
      }
    };

    // Delay the check to avoid too many requests while typing
    const timeoutId = setTimeout(checkAvailability, 500);

    return () => clearTimeout(timeoutId);
  }, [username]);

  if (isPending) {
    return <LoadingSignUpPage/>
  }
  if (!fetchedUser && !isPending) {
    return (
      <form
        onSubmit={handleSubmit}
        className={`lg:w-[40vw] md:w-[80vw] w-[90vw] mx-auto mt-4 p-4 shadow-md rounded-md ${theme === 'dark' ? 'bg-white' : 'bg-[#f0f1f3]'
          }`}
      >
                        <h1 className='text-xl text-center dark:text-black font-semibold'>Sign Up</h1>
        <label htmlFor="name" className="block mb-2 text-gray-600">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${inputClasses}`}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        {!errors.name && name != "" && name.length < 3 && <p className="text-red-500 text-sm">{"Name should be at least 3 character long"}</p>}
        <label htmlFor="username" className="block mt-4 mb-2 text-gray-600">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`${inputClasses} ${username !== "" && (isUsernameAvailable ? 'focus:border-blue-500' : 'border-red-500')
            }`}
        />
        {
          usernameChecking ? <p className="text-sm text-black">Checking availability <span className="loading loading-spinner loading-xs"></span></p> : (
            !isUsernameAvailable && username.length > 3 && (
              <p className="text-red-500 text-sm">Username not available. Try another.</p>
            ) || isUsernameAvailable && (
              <p className="text-green-500 text-sm">Username is available.</p>
            ))
        }
        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

        <label htmlFor="email" className="block mt-4 mb-2 text-gray-600">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${inputClasses}`}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <label htmlFor="phone" className="block mt-4 mb-2 text-gray-600">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={`${inputClasses}`}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

        <label htmlFor="gender" className="block mt-4 mb-2 text-gray-600">
          Gender
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className={`${inputClasses}`}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}

        <label htmlFor="password" className="block mt-4 mb-2 text-gray-600">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${inputClasses}`}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <label htmlFor="retypePassword" className="block mt-4 mb-2 text-gray-600">
          Retype Password
        </label>
        <input
          type="password"
          id="retypePassword"
          value={retypePassword}
          onChange={(e) => setRetypePassword(e.target.value)}
          className={`${inputClasses}`}
        />
        {errors.retypePassword && (
          <p className="text-red-500 text-sm">{errors.retypePassword}</p>
        )}

        <button
          type="submit"
          className="mt-6 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Sign Up
        </button>
        <div className='my-2 dark:text-black'>
                    <p className='text-sm'>Already have an account? Please <button onClick={()=>push("/login")} title='goto login' className='text-blue-600 italic'>login</button>.</p>
                </div>
      </form>
    );
  }
};

export default SignUpForm;
