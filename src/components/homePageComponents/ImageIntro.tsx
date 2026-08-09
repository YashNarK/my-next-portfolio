import { useAppTheme } from "@/hooks/useAppTheme";
import { useProfileConfig } from "@/hooks/useProfileConfig";
import { Box } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

const ImageIntro = () => {
  const theme = useAppTheme();
  const { profileConfig } = useProfileConfig();
  const [hasEntered, setHasEntered] = useState(false);

  const imageUrl = profileConfig?.imageUrl || profileConfig?.thumbUrl;
  const blurDataURL = profileConfig?.blurDataURL;
  const mySignUrl = `/img/sign-${
    theme.palette.mode === "light" ? "black" : "white"
  }.png`;

  // The entrance animation runs as soon as the component mounts. It used to be
  // gated on the photo finishing its download, which is what left the page
  // blank: nothing was on screen until a Firestore round trip *and* a full
  // image download had both completed.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setHasEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        transform: hasEntered
          ? { xs: "translateY(0)", sm: "translateX(0)" }
          : { xs: "translateY(-120vh)", sm: "translateX(-120vw)" },
        opacity: hasEntered ? 1 : 0,
        transition:
          "transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease",
        willChange: "transform, opacity",
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
              // The stored photo is already cropped and downscaled to 512px at
              // quality 0.82 on upload, so the optimizer has little left to do —
              // and skipping it keeps the URL identical to the <link rel="preload">
              // emitted in the document head, so that preload is actually reused.
              unoptimized
              {...(blurDataURL
                ? { placeholder: "blur" as const, blurDataURL }
                : {})}
            />
          ) : null}
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            width: { xs: "120px", sm: "200px" },
            height: { xs: "62px", sm: "103px" },
            opacity: 0.8,
            pointerEvents: "none",
          }}
        >
          <Image
            src={mySignUrl}
            alt="Signature"
            fill
            sizes="(max-width: 600px) 120px, 200px"
            style={{ objectFit: "contain" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ImageIntro;
