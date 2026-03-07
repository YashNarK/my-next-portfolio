import { useAppTheme } from "@/hooks/useAppTheme";
import { useProfileConfig } from "@/hooks/useProfileConfig";
import { Box } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

const ImageIntro = () => {
  const theme = useAppTheme();
  const { profileConfig, isLoading } = useProfileConfig();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const imageUrl = profileConfig?.imageUrl || profileConfig?.thumbUrl;
  const mySignUrl = `/img/sign-${
    theme.palette.mode === "light" ? "black" : "white"
  }.png`;

  useEffect(() => {
    let isActive = true;

    if (isLoading) {
      setIsImageLoaded(false);
      return () => {
        isActive = false;
      };
    }

    // If there is no profile image configured, avoid keeping the intro hidden.
    if (!imageUrl) {
      setIsImageLoaded(true);
      return () => {
        isActive = false;
      };
    }

    setIsImageLoaded(false);
    const preload = new window.Image();
    preload.src = imageUrl;

    const markLoaded = () => {
      if (isActive) setIsImageLoaded(true);
    };

    if (preload.complete) {
      markLoaded();
    } else {
      preload.onload = markLoaded;
      preload.onerror = markLoaded;
    }

    return () => {
      isActive = false;
      preload.onload = null;
      preload.onerror = null;
    };
  }, [imageUrl, isLoading]);

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        transform: isImageLoaded
          ? { xs: "translateY(0)", sm: "translateX(0)" }
          : { xs: "translateY(-120vh)", sm: "translateX(-120vw)" },
        opacity: isImageLoaded ? 1 : 0,
        transition:
          "transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease",
        willChange: "transform, opacity",
        pointerEvents: isImageLoaded ? "auto" : "none",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: { xs: "230px", sm: "360px" },
          height: { xs: "230px", sm: "360px" },
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: theme.palette.background.paper,
            overflow: "hidden",
            borderRadius: "50%",
          }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Profile photo"
              fill
              sizes="(max-width: 600px) 230px, 360px"
              style={{ objectFit: "cover" }}
              priority
            />
          ) : null}
        </Box>
        <Box
          component="img"
          src={mySignUrl}
          alt="Signature"
          sx={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            width: { xs: "120px", sm: "200px" },
            opacity: 0.8,
          }}
        />
      </Box>
    </Box>
  );
};

export default ImageIntro;
