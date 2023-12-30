import toast from "react-hot-toast";
const copyToClipboard = (text) => {
  if (!window?.navigator?.clipboard) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    toast.success("copied")
    document.body.removeChild(textarea);
  } else {
    navigator.clipboard
      .writeText(text)
      .then(function () {
        toast.success("copied")
      })
      .catch(function () {
        toast.error("error. try again")
      });
  }
};

export default copyToClipboard;
