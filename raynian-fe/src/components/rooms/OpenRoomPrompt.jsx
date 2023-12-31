import React, { useEffect, useState } from "react";
import { socketServerConnect } from "../socket/socketConnection";
import { useDispatch, useSelector } from "react-redux";
import { connectToRoom, setUserInfo, createRoom } from "../../slices/roomSlice";
import { generateGuestCredentials } from "../../slices/authSlice";
import { joinRoom } from "../socket/socketConnection";
import { BsFillBrightnessHighFill } from "react-icons/bs";
import { FaRegMoon } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import CloseModalButton from "../util/CloseModalButton";

const OpenRoomPrompt = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { roomId } = useSelector((state) => state.room);

  const dispatch = useDispatch();
  const [isPublic, setIsPublic] = useState(true);

  const handlePublicToggle = () => {
    setIsPublic((prevIsPublic) => !prevIsPublic);
  };

  const handleSubmit = () => {
    socketServerConnect();
    handleCreateRoom();
  };

  const handleCreateRoom = async () => {
    try {
      const req = {
        userId: userInfo.user._id,
        username: userInfo.user.username,
        roomSettings: {},
        public: isPublic,
      };

      await dispatch(createRoom(req));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (roomId != null) {
      console.log("testing join room");
      joinRoom({
        roomId: roomId,
        user: {
          _id: userInfo.user._id,
          username: userInfo.user.username,
          profilePicture: userInfo.user.profilePicture,
        },
      });
    }
  }, [roomId]);

  const refreshUsername = () => {
    dispatch(generateGuestCredentials());
  };

  return (
    <div
      className="relative flex w-[450px] flex-col rounded-3xl bg-neutral-50 px-[30px] py-10"
      onClick={(event) => event.stopPropagation()}
    >
      <CloseModalButton />
      <div className="mb-4">
        <div className="text-center text-2xl">
          Open up your room for others to join!
        </div>
        <div>
          <div className="text-center text-sm italic">
            {userInfo.user._id === "guest" ? (
              <div className="flex flex-col items-center justify-center ">
                <div className="select-none">
                  (<span className="select-text">You are not signed in. </span>
                  Joining as{" "}
                  <span className="text-sm font-medium italic text-blue-700 select-text">
                    {userInfo.user.username}
                  </span>
                  )
                </div>
                <FiRefreshCcw
                  className="cursor-pointer"
                  onClick={refreshUsername}
                />
              </div>
            ) : (
              <>
                (Joining as{" "}
                <span className="text-sm font-medium italic text-blue-700">
                  {userInfo.user.username})
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <label htmlFor="privateCheckbox" className="flex items-center">
          <input
            type="checkbox"
            id="privateCheckbox"
            checked={!isPublic}
            onChange={handlePublicToggle}
            className="mr-2"
          />
          <span className="text-lg font-medium">
            Private <span className="text-base">(invite only)</span>
          </span>
        </label>
        <button
          className="ml-2 rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={handleSubmit}
        >
          Start Live Session
        </button>
      </div>
    </div>
  );
};

export default OpenRoomPrompt;
