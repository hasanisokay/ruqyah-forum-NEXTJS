'use client'
import useTheme from "@/hooks/useTheme";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const LoadingNavbar = () => {
    const { theme } = useTheme();
    const baseColor = theme === "dark" ? "#7d7d7d" : "#f4f4f4"
    const highlightColor = theme === "dark" ? "#e3ebdb" : "#b2b2b2"
    return (
        <div className=" flex md:px-10 px-4 justify-between items-center">
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
    );
};

export default LoadingNavbar;