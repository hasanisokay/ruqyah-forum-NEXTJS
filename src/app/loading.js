import "react-loading-skeleton/dist/skeleton.css";
import LoadingCards from "@/components/LoadingCards";
const RootLoading = () => {
  return (
    <div>
      <LoadingCards></LoadingCards>
      <LoadingCards></LoadingCards>
    </div>
  );
};

export default RootLoading;
