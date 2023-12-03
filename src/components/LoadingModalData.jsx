'use client'
import useTheme from "@/hooks/useTheme";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const LoadingModalData = () => {
    const { theme } = useTheme();
    const baseColor = theme ==="dark" ? "#7d7d7d":"#f4f4f4" 
    const highlightColor = theme ==="dark" ? "#e3ebdb":"#b2b2b2" 
    return (
        <div className=" p-2 m-2">
            <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                <div className="flex items-center justify-center">
                    <Skeleton count={1} width={40} height={40} />
                </div>
                <div className="mt-4">
                    <Skeleton count={3} height={9} width={200}/>
                </div>
            </SkeletonTheme>
        </div>
    );
};

export default LoadingModalData;