const commonNavData = [
    {
      path: "/",
      title: "Home",
    },
    {
      path: "/notice",
      title: "Notice",
    },
  ];
  
  export const afterLoginNavData = [
    ...commonNavData,
    {
      path: "/profile",
      title: "Profile",
    },
  ];
  
  export const beforeLoginNavData = [
    ...commonNavData,
    {
      path: "/signup",
      title: "Signup",
    },
    {
      path: "/login",
      title: "Login",
    },
  ];