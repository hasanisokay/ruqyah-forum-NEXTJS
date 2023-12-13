import handleDeletePost from "@/utils/handleDeletePost";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const DeleteConfirmationModal = ({ id, isAuthorized, setterFunction }) => {
    const router = useRouter();
    const pathname = usePathname();

    const setConfirm = async (confirm) => {
        setterFunction(false);
        if (!confirm) {
            return toast.error("Canceled");
        }
        await handleDeletePost(id, isAuthorized);
        if (pathname !== "/") {
            router?.push("/")
        }
    }
    return (
        <div>
            <dialog id="deletModal" className="modal">
                <div className="modal-box">
                    <p className="text-center font-semibold">Sure to do this?</p>
                    <div className="flex gap-2 justify-center items-center">
                        <button className="forum-btn1 bg-red-600" onClick={() => setConfirm(true)}>Hit it</button>
                        <button className="forum-btn1 bg-[#308853]" onClick={() => setConfirm(false)}>No, changed my mind</button>

                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button></button>
                </form>
            </dialog>




        </div>
    );
};

export default DeleteConfirmationModal;
