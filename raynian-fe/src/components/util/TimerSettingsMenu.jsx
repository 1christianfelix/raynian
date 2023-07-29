import React from "react";
import { useContext, useState, useRef, useEffect } from "react";
import { TimerContext } from "../../context/TimerContext";
import BgCustomizerMenu from "../ui/background-customizer/BgCustomizerMenu";

export default function TimerSettingsMenu(props) {
  const { type } = props;
  const [search, setSearch] = useState("");
  const backgroundList = [
    { id: 1, name: "TEST" },
    { id: 2, name: "TEST" },
    { id: 3, name: "TEST" },
    { id: 4, name: "TEST" },
    { id: 5, name: "TEST" },
    { id: 6, name: "TEST" },
    { id: 7, name: "TEST" },
    { id: 8, name: "TEST" },
    { id: 9, name: "TEST" },
    { id: 10, name: "TEST" },
    { id: 11, name: "TEST" },
    { id: 12, name: "TEST" },
    { id: 1, name: "TEST" },
    { id: 2, name: "TEST" },
    { id: 3, name: "TEST" },
    { id: 4, name: "TEST" },
    { id: 5, name: "TEST" },
    { id: 6, name: "TEST" },
    { id: 7, name: "TEST" },
    { id: 8, name: "TEST" },
    { id: 9, name: "TEST" },
    { id: 10, name: "TEST" },
    { id: 11, name: "TEST" },
    { id: 12, name: "TEST" },
  ];

  const { workTime, setWorkTime, breakTime, setBreakTime, playSound } =
    useContext(TimerContext);

  let content;

  if (type === "work") {
    content = (
      <div className="bg-white drop-shadow-md rounded-md text-sm absolute dark:bg-slate-700 left-[115px] top-[0px]">
        <p
          className="whitespace-nowrap py-[5px] px-[20px] hover:bg-gray-200 dark:hover:bg-gray-600 py"
          onClick={(e) => {
            e.stopPropagation();
            setWorkTime("60 min");
          }}
        >
          60 min
        </p>
        <p
          className="whitespace-nowrap py-[5px] px-[20px] hover:bg-gray-200 dark:hover:bg-gray-600over:bg-gray-200 dark:hover:bg-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            setWorkTime("45 min");
          }}
        >
          45 min
        </p>
        <p
          className="whitespace-nowrap py-[5px] px-[20px] hover:bg-gray-200 dark:hover:bg-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            setWorkTime("30 min");
          }}
        >
          30 min
        </p>
      </div>
    );
  }
  if (type === "break") {
    content = (
      <div className="bg-white drop-shadow-md rounded-md text-sm absolute dark:bg-slate-700 left-[115px] top-[0px]">
        <p
          className="whitespace-nowrap py-[5px] px-[20px] hover:bg-gray-200 dark:hover:bg-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            setBreakTime("15 min");
          }}
        >
          15 min
        </p>
        <p
          className="whitespace-nowrap py-[5px] px-[20px] hover:bg-gray-200 dark:hover:bg-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            setBreakTime("10 min");
          }}
        >
          10 min
        </p>
        <p
          className="whitespace-nowrap py-[5px] px-[20px] hover:bg-gray-200 dark:hover:bg-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            setBreakTime("5 min");
          }}
        >
          5 min
        </p>
      </div>
    );
  }
  if (type === "alarm") {
    content = (
      <div className="bg-white drop-shadow-md rounded-md text-sm absolute dark:bg-slate-700 left-[115px] top-[0px] overflow-auto w-[250px] h-[250px]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2"
          placeholder="Search..."
        />
        <div className="grid grid-cols-4 gap-4 p-4">
          {backgroundList.map((item) => (
            <div key={item.id} className="bg-slate-300 w-[50px] h-[50px]">
              <p>a</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (type === "background") {
    content = (
      <div className="scale-75">
        <BgCustomizerMenu />
      </div>
    );
  }
  return content;
}