import React, { useContext } from "react";
import { ModalContext } from "../../context/ModalContext";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import AfkCheckPage from "../pages/AfkCheckPage";
import JoinRoomPrompt from "../rooms/JoinRoomPrompt";
import { RxCross1 } from "react-icons/rx";

export default function Modal(props) {
  const { type, setType } = useContext(ModalContext);

  let content = null;

  const handleContent = () => {
    setType(null);
  };

  if (type) {
    content = (
      <div className="absolute flex h-screen w-[100%] items-center justify-center">
        <div className="relative z-[60]">
          <div className="absolute right-4 top-4">
            <div onClick={handleContent} className="cursor-pointer">
              <RxCross1 />
            </div>
          </div>
          {type === "login" && <LoginPage />}
          {type === "signup" && <SignupPage />}
          {type === "afk" && <AfkCheckPage />}
          {type === "joinRoomPrompt" && <JoinRoomPrompt />}
        </div>
        <div
          className="absolute z-50 h-screen w-screen bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleContent}
        ></div>
      </div>
    );
  }
  return <>{content}</>;
}
