import React from "react";
import TimerDisplay from "./TimerDisplay";
import TimerContols from "./TimerContols";
import TimerSettings from "./TimerSettings";

const Timer2 = () => {
  return (
    <div>
      <div className="flex items-center">
        <TimerDisplay />
        <TimerContols />
      </div>
      <TimerSettings />
    </div>
  );
};

export default Timer2;