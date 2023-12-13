'use client'
import useTheme from "@/hooks/useTheme";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const LoadingChat = () => {
    const { theme } = useTheme();
    const baseColor = theme === "dark" ? "#7d7d7d" : "#f4f4f4"
    const highlightColor = theme === "dark" ? "#e3ebdb" : "#b2b2b2"
    return (
        <div className="flex flex-col items-center justify-center p-2 m-2">
            <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                <Skeleton count={6} width={290} height={8} />
            </SkeletonTheme>
        </div>
    );
};

export default LoadingChat;