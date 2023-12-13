'use client'
import useTheme from "@/hooks/useTheme";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const LoadingLikers = () => {
    const { theme } = useTheme();
    const baseColor = theme === "dark" ? "#7d7d7d" : "#f4f4f4"
    const highlightColor = theme === "dark" ? "#e3ebdb" : "#b2b2b2"
    return (
        <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
            <div className="flex gap-2 items-center ">
                <Skeleton count={1} width={30} height={30} circle />
                <div className="flex flex-col">
                    <Skeleton count={1} width={50} height={4} />
                    <Skeleton count={1} width={20} height={4} />
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default LoadingLikers;