"use client";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Typography, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import { useState, useRef, useEffect } from "react";

const SlideButton = () => {
  const [progress, setProgress] = useState(10);
  const [isDragging, setIsDragging] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const theme = useAppTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));
  const buttonLabel = isPhone ? "Swipe for Resume" : "Slide for Resume";
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const preventScroll = (e: TouchEvent) => e.preventDefault();
    slider.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      slider.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  const handleStart = () => {
    if (!isDownloading) setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !sliderRef.current || isDownloading) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    const newProgress = Math.min(
      98,
      Math.max(2, ((clientX - sliderRect.left) / sliderRect.width) * 100)
    );
    setProgress(newProgress);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    handleMove(e.touches[0].clientX);
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (progress >= 85) {
      const resumeURL = `${window.location.origin}/resume`;
      window.open(resumeURL, "_blank");
      setProgress(10);
      setIsDownloading(false);
    } else {
      setProgress(10);
    }
  };

  const rocketLeftPosition = `calc(${progress}% - 38px)`;

  return (
    <Box
      sx={{
        textAlign: { xs: "start", sm: "center" },
        position: "relative",
      }}
    >
      <Box mb={"12px"} position={"relative"} zIndex={3}>
        <Typography
          component={"span"}
          variant="professional"
          sx={{
            fontSize: { xs: "12px", sm: "16px" },
            color: theme.palette.text.primary,
            WebkitTextStroke: `0.1px ${theme.palette.text.primary}`,
          }}
        >
          {buttonLabel}
        </Typography>
      </Box>
      <Box
        ref={sliderRef}
        position={"relative"}
        zIndex={2}
        sx={{
          width: {
            xs: "200px", // phones
            sm: "320px", // tablets and up
          },
          height: {
            xs: "30px",
            sm: "60px",
          },
          background: `url('/img/starry-sky-mini.png') no-repeat center center`,
          backgroundSize: "cover",
          borderRadius: "30px",
          display: "flex",
          alignItems: "center",
          padding: {
            xs: "0 20px",
            sm: "0 30px",
          },
          userSelect: "none",
          overflow: "visible",
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
      >
        {/* Rocket GIF */}
        <img
          src="/img/rocket-moving-colored.gif"
          alt="Rocket"
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          style={{
            position: "absolute",
            left: rocketLeftPosition,
            top: "50%",
            transform: isDownloading
              ? "translateY(-50%) rotate(720deg) scale(0)"
              : "translateY(-50%) rotate(90deg)",
            cursor: "grab",
            width: "50px",
            height: "80px",
            zIndex: 2,
            transition: "transform 1s ease-in-out, opacity 1s ease-in-out",
            opacity: isDownloading ? 0 : 1,
          }}
        />

        {/* Black Hole */}
        <img
          src="/svg/blackhole.svg"
          alt="Black Hole"
          style={{
            position: "absolute",
            right: "-30px",
            width: "100px",
            height: "100px",
            zIndex: 1,
          }}
        />
      </Box>
    </Box>
  );
};

export default SlideButton;
