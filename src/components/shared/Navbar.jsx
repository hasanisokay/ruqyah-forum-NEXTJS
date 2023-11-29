'use client'
import Link from "next/link";
import logo from "../../../public/images/logo-new.png";
import Image from 'next/image';
import NavLink from "./NavLink";
import { afterLoginNavData, beforeLoginNavData } from "@/data/navData";
import useTheme from "@/hooks/useTheme";
import { useContext, useEffect, useRef, useState, useTransition } from "react";
import AuthContext from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { FaBell } from "react-icons/fa6";
import axios from "axios";
import toast from "react-hot-toast";
const Navbar = () => {
  const [navToggle, setNavToggle] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { fetchedUser, loading, logOut, loggedOut, notificationsCount, allNotifications } = useContext(AuthContext);
  const [navData, setNavData] = useState()
  const router = useRouter();
  const [isPending, startTransition] = useTransition()
  const navRef = useRef(null);
  const baseColor = theme === "dark" ? "#7d7d7d" : "#f4f4f4"
  const highlightColor = theme === "dark" ? "#e3ebdb" : "#b2b2b2"
  useEffect(() => {
    setNavData(fetchedUser ? afterLoginNavData : beforeLoginNavData)
  }, [fetchedUser, loggedOut])

  useEffect(() => {
    if (fetchedUser) {
      startTransition(() => {
        router.refresh()
      });
    }
  }, [fetchedUser, router, loggedOut]);
  useEffect(() => {
    startTransition(() => {
      router.refresh()
    });
  }, [loading, router])
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotificationMenu &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setShowNotificationMenu(!showNotificationMenu);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showNotificationMenu]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setNavToggle(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleNotificationsClick = async (id, read) => {
    if (!fetchedUser) {
      return toast.error("login to continue");
    }
    if (read === false) {
      const data = await axios.post("/api/readnotification", { id, username: fetchedUser.username })
      if (data.status === 200) {
       return router.push(`/${id}`)
      }
    }
    return router.push(`/${id}`)
  };

  if (loading) {
    return <div className="flex md:px-10 px-4 justify-between items-center">
      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
        <p>
          <Skeleton count={1} width={150} height={30} />
        </p>
        <p className="lg:hidden">
          <Skeleton count={1} width={50} height={20} />
        </p>
        <p className="gap-2 items-center lg:flex hidden">
          <Skeleton count={5} width={40} height={10} inline style={{ marginRight: "16px", marginLeft: "16px" }} />
          <Skeleton count={1} width={50} height={30} borderRadius={"100%"} />
        </p>
      </SkeletonTheme>
    </div>
  }
  if (!loading) return (
    <div className="flex md:px-10 px-4 lg:justify-between justify-between items-center font-semibold" ref={navRef}>
      <Link href={"/"}><Image placeholder="blur" src={logo} alt="logo" width={150} /></Link>

      <div
        className={`absolute ${navToggle ? "right-0" : "left-[-120%]"
          } top-[4.5rem] w-[40vw] flex justify-center items-center bg-slate-200 py-3 rounded-xl transition-all duration-1000 dark:bg-slate-900 lg:static lg:w-[unset] lg:flex-row lg:bg-transparent lg:pb-0 lg:pt-0 dark:lg:bg-transparent`}
      >

        <ul className="flex flex-col lg:flex-row gap-4 items-center justify-center mr-6">
          {
            navData?.map(({ path, title }) => <li key={path}>
              <NavLink activeClassName={"text-[#308853] text-semibold"} href={path} exact={path === "/" && true}>{title}</NavLink>
            </li>)
          }
          {
            fetchedUser?.isAdmin && <li><NavLink activeClassName={"text-[#308853] text-semibold"} href={"/admin"}>Admin</NavLink></li>
          }
          {
            fetchedUser && <li onClick={logOut} className="cursor-pointer" title="Log out from your account">LogOut</li>
          }
          <label className="swap swap-rotate lg:ml-2">
            <input
              onChange={toggleTheme}
              type="checkbox"
              checked={theme === "dark"}
            />
            <svg
              className="swap-on h-6 w-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
            <svg
              className="swap-off h-6 w-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
          {
            fetchedUser && <div className="lg:block hidden">
              <div tabIndex={0} role="button" className="">
                <div className=" relative">
                  <FaBell onClick={() => setShowNotificationMenu(!showNotificationMenu)} title="notifications" className={`${notificationsCount > 0 ? "text-red-500" : ""}`} />
                  <div className="text-red-400 absolute -right-[20%] cursor-default  font-semibold -top-[30%] text-[8px]">{notificationsCount > 0 ? notificationsCount : ""}</div>
                </div>
              </div>
            </div>
          }
        </ul>
      </div>
      {
        showNotificationMenu && <div className={`rounded-md absolute mx-2 right-0 top-14 w-[70vw] bg-gray-300 transition-all duration-1000 dark:bg-slate-900 lg:w-[unset] lg:bg-transparent text-sm dark:lg:bg-transparent`}>
          <ul className=" shadow bg-base-200 rounded-md">
            {allNotifications?.map((n, index) => (
              <li
                key={index}
                onClick={() => handleNotificationsClick(n.postID, n.read)}
                className={`p-2 font-normal  rounded-lg lg:hover:bg-slate-500 lg:hover:text-white cursor-pointer my-1 ${n.read === false ? "bg-slate-300 dark:bg-slate-800" : "bg-slate-100 dark:bg-inherit"
                  }`}
              >
                {n.message}
              </li>
            ))}
            <li className="p-2 font-normal text-sm rounded-lg lg:hover:bg-slate-500 lg:hover:text-white cursor-pointer mt-1 text-center"><Link href={"/notifications"}>See All</Link></li>
          </ul>
        </div>
      }

      <div className="lg:hidden flex items-center">
        {
          fetchedUser && <div className="lg:hidden">
            <div tabIndex={0} role="button" className="">
              <div className=" relative">
                <FaBell onClick={() => setShowNotificationMenu(!showNotificationMenu)} title="notifications" className={`${notificationsCount > 0 ? "text-red-500" : ""}`} />
                <div className="text-red-400 absolute -right-[20%] cursor-default  font-semibold -top-[30%] text-[8px]">{notificationsCount > 0 ? notificationsCount : ""}</div>
              </div>
            </div>
          </div>
        }

        <label className="swap-rotate swap btn-ghost btn-circle btn ml-2 bg-white dark:bg-slate-800 lg:hidden">
          <input
            checked={navToggle}
            onChange={() => setNavToggle((pre) => !pre)}
            type="checkbox"
          />
          <svg
            className="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>
          <svg
            className="swap-on fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
          </svg>
        </label>

      </div>
    </div>

  );
};

export default Navbar;