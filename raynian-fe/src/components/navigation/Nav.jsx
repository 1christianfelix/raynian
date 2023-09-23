/* eslint-disable tailwindcss/no-custom-classname */
import React, { useEffect, useState, useRef, useContext } from "react";
import { CiUser } from "react-icons/ci";
import UserDropdown from "../util/UserDropdown";
import thick_logo from "../../assets/thick_logo.svg";
import RoomButton from "../rooms/RoomButton";
import { PiImagesSquareThin } from "react-icons/pi";
import { ModalContext } from "../../context/ModalContext";

export default function Nav() {
  const { toggleBackgroundSettings } = useContext(ModalContext);
  const [openDropdown, setToggleDropdown] = useState(false);
  const navRef = useRef();

  const toggleDropdown = () => {
    setToggleDropdown(!openDropdown);
  };

  useEffect(() => {}, [openDropdown]);

  return (
    <div className="flex h-16 select-none px-[25px]">
      <div className="flex items-center gap-1">
        <img src={thick_logo} alt="logo" className="h-[3rem] dark:invert" />
        <p className="text-3xl ">raynian</p>
      </div>

      <div className="ml-auto flex items-center gap-2 bg-white/10 px-4 backdrop-blur-md">
        <RoomButton />
        <div onClick={toggleBackgroundSettings}>
          <PiImagesSquareThin
            size={45}
            className="transition-all hover:text-white dark:hover:text-neutral-900 cursor-pointer"
          />
        </div>
        <div className="relative" ref={navRef} onClick={() => toggleDropdown()}>
          <CiUser
            size={45}
            className="transition-all hover:text-white dark:hover:text-neutral-900 cursor-pointer"
            onClick={() => toggleDropdown()}
          />
          <UserDropdown
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            setToggleDropdown={setToggleDropdown}
            navRef={navRef}
          />
        </div>
      </div>
    </div>
  );
}
