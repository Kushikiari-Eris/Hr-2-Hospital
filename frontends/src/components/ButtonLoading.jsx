import Lottie from "lottie-react";
import loadingAnimation from "../assets/buttonLoding.json"; 

const ButtonLoading = () => {
  return (

      <Lottie animationData={loadingAnimation} loop={true} style={{ width: 200, height: 200 }} />

  );
};

export default ButtonLoading;
