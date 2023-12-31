/* eslint-disable tailwindcss/no-custom-classname */
import React, { useEffect, useRef, useState, useContext } from "react";
import { ColorPickerStatusContext } from "./ColorPickerStatusContext";
import { BGCustomContext } from "../../../context/BGCustomContext";
import Draggable from "react-draggable";
import { RgbaColorPicker } from "react-colorful";
import "./bg-customizer.css";

const GradientSliderHandle = ({ id }) => {
  const { bgProperties, setBGProperties } = useContext(BGCustomContext);

  const [color, setColor] = useState(
    id === "handle1" ? bgProperties.color1 : bgProperties.color2
  );

  const { activePicker, setActivePicker } = useContext(
    ColorPickerStatusContext
  );
  const active = activePicker === id;
  const isPickerVisible = activePicker === id;
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(
    id == "handle2" ? bgProperties.position2 : bgProperties.position1
  ); // position in pixels
  const [stopPercent, setStopPercent] = useState(
    id == "handle2" ? bgProperties.stopPercent2 : bgProperties.stopPercent1
  );
  const wasDragged = useRef(false); // ref to track if the element was dragged
  const colorStyle = {
    backgroundColor:
      id === "handle1"
        ? `rgba(${bgProperties.color1.r}, ${bgProperties.color1.g}, ${
            bgProperties.color1.b
          }, ${bgProperties.color1.a > 0.5 ? bgProperties.color1.a : 0.5})`
        : `rgba(${bgProperties.color2.r}, ${bgProperties.color2.g}, ${
            bgProperties.color2.b
          }, ${bgProperties.color2.a > 0.5 ? bgProperties.color2.a : 0.5})`,
  };

  const handleDrag = (e, ui) => {
    setIsDragging(true);
    setPosition(ui.x);
    setStopPercent(Math.round((position / 500) * 100));
    wasDragged.current = true; // update ref to note that element was dragged
  };

  const handleStop = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    // If the element was dragged, skip opening color picker
    if (wasDragged.current) {
      wasDragged.current = false; // reset ref for future clicks
    } else {
      setActivePicker(isPickerVisible ? null : id);
    }
  };

  useEffect(() => {
    // This is your new effect to listen for changes in stopPercent
    setPosition((stopPercent / 100) * 500);
  }, [stopPercent]);

  useEffect(() => {
    setBGProperties((prev) => {
      if (id === "handle1") {
        prev = {
          ...prev,
          position1: position,
          stopPercent1: stopPercent,
        };
      } else {
        prev = {
          ...prev,
          position2: position,
          stopPercent2: stopPercent,
        };
      }
      return prev;
    });
  }, [position, stopPercent]);

  return (
    <Draggable
      axis="x"
      bounds=".range-slider"
      defaultPosition={{ x: id === "handle2" ? 498 : 0, y: 0 }}
      onDrag={handleDrag}
      onStop={handleStop}
      cancel=".color-selector-container"
    >
      <div className="bg-customizer-container absolute ">
        <div
          className={`color-selector-container absolute h-[255px] w-[255px] translate-x-[-115px] translate-y-[-318px] ${
            !isPickerVisible && "hidden"
          }`}
        >
          {isPickerVisible && (
            <div
              className="color-selector"
              style={{ zIndex: active === id ? 1000 : 0 }}
            >
              <RgbaColorPicker
                color={
                  id === "handle1" ? bgProperties.color1 : bgProperties.color2
                }
                onChange={(e) => {
                  setBGProperties((prev) => {
                    console.log(e);
                    if (id === "handle1") {
                      prev = {
                        ...prev,
                        color1: e,
                      };
                    } else {
                      prev = {
                        ...prev,
                        color2: e,
                      };
                    }
                    return prev;
                  });
                }}
              />
            </div>
          )}
        </div>
        <div
          className={`handle flex h-8 w-8 -translate-y-[.35rem] items-center justify-center rounded-full border border-white bg-red-500 drop-shadow-sm ${
            isDragging && "scale-125"
          } ${active && "scale-125"}`}
          style={{
            // left: `${position}px`,
            ...colorStyle,
          }}
          onClick={handleClick}
        >
          <div className="tooltip-slider tooltip w-44 flex flex-col">
            <div>{colorStyle.backgroundColor}</div>
            <div>{stopPercent}%</div>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default GradientSliderHandle;
