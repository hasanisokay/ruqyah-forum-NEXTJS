import Image from "next/image";
import spinner from "@/../public/images/spinner.gif"
const PostLoading = () => {
    return (
        <div className="flex items-center justify-center flex-col">
            <Image alt="loader" src={spinner} width={100}/>
        <h1 className="text-3xl font-semibold">Please Wait...</h1>
        </div>
    );
};

export default PostLoading;