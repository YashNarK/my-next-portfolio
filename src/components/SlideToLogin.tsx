import { useState, useRef, MouseEvent, useMemo } from "react";
import RocketIcon from "@mui/icons-material/Rocket";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { SvgIcon } from "@mui/material";

const SlideToLogin = () => {
  const [progress, setProgress] = useState(10); // Start slightly inside
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    const newProgress = Math.min(
      98, // Stop slightly before the black hole
      Math.max(2, ((e.clientX - sliderRect.left) / sliderRect.width) * 100) // Start slightly inside
    );

    setProgress(newProgress);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (progress >= 95) {
      alert("🚀 Logged In!");
      setProgress(10); // Reset after login
    }
    setProgress(10);
  };

  const rocketLeftPosition = `calc(${progress}% - 38px)`;
  const rocketTransform = `translateY(-50%) rotate(${
    progress < 12 ? "90" : "45"
  }deg)`;

  // Use RocketLaunchIcon only beyond 12%
  const RocketComponent = useMemo(() => {
    if (progress < 12) {
      return <RocketIcon style={{ fontSize: 48, color: "white" }} />;
    } else {
      return (
        <SvgIcon
          component={RocketLaunchIcon}
          inheritViewBox
          sx={{
            fontSize: 48,
            color: "red",
          }}
        />
      );
    }
  }, [progress]);

  return (
    <div
      ref={sliderRef}
      style={{
        position: "relative",
        width: "320px",
        height: "60px",
        background: `url('/img/space-image.jpg') no-repeat center center`,
        borderRadius: "30px",
        display: "flex",
        alignItems: "center",
        padding: "0 30px",
        userSelect: "none",
        overflow: "visible", // Prevents rocket clipping
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Rocket Icon (Draggable) */}
      <div
        style={{
          position: "absolute",
          left: rocketLeftPosition, // Ensures proper visibility
          top: "50%",
          transform: rocketTransform,
          cursor: "grab",
          zIndex: 2,
        }}
        onMouseDown={handleMouseDown}
      >
        {RocketComponent}
      </div>

      {/* Black Hole (Goal) */}
      {/* <div
        style={{
          position: "absolute",
          right: "0px",
          width: "50px",
          height: "50px",
          background: "black",
          borderRadius: "50%",
          boxShadow: "0 0 20px black",
          zIndex: 1,
        }}
          
      ></div> */}

      {/* Black Hole (Goal) - Using SVG from public folder */}
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
    </div>
  );
};

export default SlideToLogin;
