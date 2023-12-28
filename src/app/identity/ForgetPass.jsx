'use client'
import useTheme from "@/hooks/useTheme";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const ForgetPass = () => {
    const { theme } = useTheme();
    const [username, setUsername] = useState('');
    const [disableForm, setDisableForm] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [showNewPasswordField, setShowNewPasswordField] = useState(false);
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [otpFormVisible, setOtpFormVisible] = useState(false);
    const [newPasword, setNewPaasword] = useState("");
    const [confirmNewPasword, setConfirmNewPaasword] = useState("");
    const router = useRouter();
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        otp: "",
        newPasword: ""
    });
    const inputClasses = `w-full p-2 border rounded-md focus:outline-none focus:border-blue-500 ${theme === 'dark' ? 'bg-black' : 'bg-white'
        } `;

    const handleGetOTPForm = async (e) => {
        e.preventDefault()
        setErrors({
            username: '',
            password: '',
            otp: '',
            newPassword: ''
        });
        if (!username) {
            setErrors((prevErrors) => ({ ...prevErrors, username: 'Username is required' }));
            return
        }
        if (!email) {
            setErrors((prevErrors) => ({ ...prevErrors, email: 'Email is required' }));
            return
        }
        const toastId = toast.loading("checking");
        setDisableForm(true);
        const { data } = await axios.post("/api/forgetpass", { username, email })
        toast.dismiss(toastId)
        setDisableForm(false);
        if (data.status === 200) {
            toast.success(data.message);
            setOtpFormVisible(true);
            setShowOTPInput(true);
        }
        if (data.status === 404) {
            toast.error(data.message);
        }
    }
    const handleCheckOTPForm = async (e) => {
        e.preventDefault();
        setErrors({
            username: '',
            password: '',
            otp: '',
            newPassword: ''
        });
        if (otp === "") {
            setErrors((prevErrors) => ({ ...prevErrors, otp: 'OTP is required' }));
            return
        }
        if (otp?.length !== 6) {
            setErrors((prevErrors) => ({ ...prevErrors, otp: 'OTP should be 6 character long.' }));
            return
        }
        const toastId = toast.loading("checking");
        setDisableForm(true);
        const { data } = await axios.post("/api/checkotp", { otp, username })
        toast.dismiss(toastId)
        setDisableForm(false);

        if (data.status === 200) {
            toast.success(data.message);
            setOtpFormVisible(false);
            setShowOTPInput(false);
            setShowNewPasswordField(true)
        }
        else if (data.status === 403) {
            toast.error(data.message);
            router.push("/identity");
        }
        else {
            toast.error(data.message);
            setOtp("")
        }
    }
    const handleNewPassword = async (e) => {
        e.preventDefault();
        setErrors({
            username: '',
            password: '',
            otp: '',
            newPassword: ''
        });
        if (newPasword === "" || confirmNewPasword === "") {
            return
        }
        if (newPasword !== confirmNewPasword) {
            setErrors((prevErrors) => ({ ...prevErrors, newPasword: 'Passwords do not match.' }));
            return
        }
        const toastId = toast.loading("Please wait");
        const { data } = await axios.post("/api/setnewpassword", { username, newPasword })
        toast.dismiss(toastId);
        if (data.status === 200) {
            toast.success(data.message);
            setOtpFormVisible(false);
            setShowOTPInput(false);
            setShowNewPasswordField(false);
            router.push("/login");
        }
        if (data.status === 404) {
            toast.error(data.message);
        }
    }
    return (
        <div>
            {!showOTPInput && !showNewPasswordField && <form className={`lg:w-[40vw] md:w-[80vw] w-[90vw] mx-auto mt-4 p-4 shadow-md rounded-md ${theme === 'dark' ? 'bg-white' : 'bg-[#f0f1f3]'} ${disableForm ? "opacity-50" : "opacity-100"}`}
                onSubmit={(e) => handleGetOTPForm(e)}>
                <h1 className='text-xl text-center dark:text-black font-semibold'>Reset Password</h1>
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

                <label htmlFor="email" className="block mt-4 mb-2 text-gray-600">
                    Email
                </label>
                <input
                    type="text"
                    id="email"
                    disabled={disableForm}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${inputClasses}`}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                {username !== "" && email !== "" && <button
                    type="submit" disabled={disableForm}
                    className={`mt-6 w-full text-white p-2 rounded-md ${disableForm ? "bg-slate-400" : "bg-blue-500 hover:bg-blue-600"}`}
                >
                    Get OTP
                </button>}
            </form>}
            {
                showOTPInput && !showNewPasswordField && <form
                    className={`lg:w-[40vw] md:w-[80vw] w-[90vw] mx-auto mt-4 p-4 shadow-md rounded-md ${theme === 'dark' ? 'bg-white' : 'bg-[#f0f1f3]'
                        } ${disableForm ? 'opacity-50' : 'opacity-100'} transition-transform duration-2000 ease-in-out ${otpFormVisible ? 'transform translate-x-0' : '-translate-x-full'
                        }`}
                    onSubmit={(e) => handleCheckOTPForm(e)}
                >
                    <p className="text-black">Please check your email <span className="italic">{email}</span>. Your OTP is on its way, set to expire in 10 minutes. If you can't find it, be sure to check your spam folder.  </p>
                    <label htmlFor="otp" className="block mt-4 mb-2 text-gray-600">
                        OTP
                    </label>
                    <input
                        type="text"
                        id="otp"
                        disabled={disableForm}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className={`${inputClasses}`}
                    />
                    {errors?.otp && <p className="text-red-500 text-sm">{errors?.otp}</p>}
                    <button type="submit" className={`mt-6 w-full text-white p-2 rounded-md ${disableForm ? "bg-slate-400" : "bg-blue-500 hover:bg-blue-600"}`}>Submit</button>
                </form>
            }
            {
                showNewPasswordField && <form
                    className={`lg:w-[40vw] md:w-[80vw] w-[90vw] mx-auto mt-4 p-4 shadow-md rounded-md ${theme === 'dark' ? 'bg-white' : 'bg-[#f0f1f3]'
                        } ${disableForm ? 'opacity-50' : 'opacity-100'} transition-transform duration-2000 ease-in-out ${showNewPasswordField ? 'transform translate-x-0' : '-translate-x-full'
                        }`}
                    onSubmit={(e) => handleNewPassword(e)}
                >
                    <label htmlFor="newPassword" className="block mt-4 mb-2 text-gray-600">
                        New Password
                    </label>
                    <input
                        type="text"
                        id="newPassword"
                        disabled={disableForm}
                        value={newPasword}
                        onChange={(e) => setNewPaasword(e.target.value)}
                        className={`${inputClasses}`}
                    />
                    <label htmlFor="confirmNewPassword" className="block mt-4 mb-2 text-gray-600">
                        Confirm Password
                    </label>
                    <input
                        type="text"
                        id="confirmNewPassword"
                        disabled={disableForm}
                        value={confirmNewPasword}
                        onChange={(e) => setConfirmNewPaasword(e.target.value)}
                        className={`${inputClasses}`}
                    />
                    {errors?.newPasword && <p className="text-red-500 text-sm">{errors?.newPasword}</p>}
                    <button type="submit" className={`mt-6 w-full text-white p-2 rounded-md ${disableForm ? "bg-slate-400" : "bg-blue-500 hover:bg-blue-600"}`}>Change Password</button>
                </form>
            }
        </div>
    );
};

export default ForgetPass;