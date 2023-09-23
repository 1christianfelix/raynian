import React, { createContext, useState, useEffect, useContext } from "react";
import { usePalette } from "react-palette";
import { BGCustomContext } from "./BGCustomContext";

export const WallpaperContext = createContext();

export const WallpaperProvider = ({ children }) => {
  const { bg } = useContext(BGCustomContext);
  const [selectedImage, setSelectedImage] = useState(
    "/images/backgrounds/lofi1-pikisuperstar.jpg"
  );
  const [selectedGradient, setSelectedGradient] = useState(false);

  const [colorAccents, setColorAccents] = useState({});

  const [theme, setTheme] = useState({});

  const { data, loading, error } = usePalette(selectedImage);

  const [wallpaper, setWallpaper] = useState("");

  useEffect(() => {
    if (!selectedGradient) {
      setWallpaper(
        <img
          className="absolute -z-10 h-full w-full object-cover"
          src={selectedImage}
        ></img>
      );
    } else {
      setWallpaper(
        <div
          style={{
            position: "absolute",
            zIndex: "-10",
            height: "100%",
            width: "100%",
            background: bg,
          }}
        ></div>
      );
    }
  }, [selectedImage, selectedGradient]);

  useEffect(() => {
    console.log(data);
    setColorAccents(data);
  }, [selectedImage, data]);

  return (
    <WallpaperContext.Provider
      value={{
        selectedImage,
        setSelectedImage,
        colorAccents,
        selectedGradient,
        setSelectedGradient,
        theme,
        setTheme,
        wallpaper,
      }}
    >
      {children}
    </WallpaperContext.Provider>
  );
};
