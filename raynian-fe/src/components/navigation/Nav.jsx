import React, { useEffect, useState, useRef } from "react";
import { CiUser } from "react-icons/ci";
import UserDropdown from "../util/UserDropdown";
import thick_logo from "../../assets/thick_logo.svg";

export default function Nav() {
  const [openDropdown, setToggleDropdown] = useState(false);
  const navRef = useRef();

  const toggleDropdown = () => {
    setToggleDropdown(!openDropdown);
  };

  useEffect(() => {
    console.log(openDropdown);
  }, [openDropdown]);

  return (
    <div className="px-[25px] py-[20px] select-none">
      <div className="Header flex justify-between">
        <div className="flex items-center gap-[1.25rem]">
          <img
            src={thick_logo}
            alt="logo"
            className="h-[4.5rem] dark:filter dark:invert"
          />
          <p className="text-3xl">raynian</p>
        </div>
        <div className="relative" ref={navRef}>
          <CiUser
            size={50}
            onClick={() => {
              toggleDropdown();
            }}
            className="cursor-pointer"
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
