'use client'
import useTheme from "@/hooks/useTheme";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const LoadinginAdminActivity = () => {
    const { theme } = useTheme();
    const baseColor = theme ==="dark" ? "#7d7d7d":"#f4f4f4" 
    const highlightColor = theme ==="dark" ? "#e3ebdb":"#b2b2b2" 
    return (
        <div className="cardinhome p-2 m-2">
            <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
            <div className="flex gap-2 items-center">
                    <Skeleton count={1} width={45} height={45} circle />
                    <div>
                        <Skeleton count={1} width={150} height={10} />
                        <div className="flex gap-4 items-center">
                            <Skeleton count={1} width={60} height={8} />
                            <Skeleton count={1} width={30} height={8} />
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <Skeleton count={3}/>
                </div>
            </SkeletonTheme>
        </div>
    );
};

export default LoadinginAdminActivity;