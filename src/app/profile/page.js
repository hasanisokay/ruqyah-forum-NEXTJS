import React from "react";
import Profile from "./Profile";
import { COOKIE_NAME } from "@/constants";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

const ProfilePage = ({ user }) => {
  return (
    <div>
      <Profile></Profile>
    </div>
  );
};

export default ProfilePage;
