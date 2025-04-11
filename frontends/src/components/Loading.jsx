import Lottie from "lottie-react";
import loadingAnimation from "../assets/Loading.json"; 

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-opacity-50">
      <Lottie animationData={loadingAnimation} loop={true} style={{ width: 300, height: 300 }} />
    </div>
  );
};

export default Loading;
