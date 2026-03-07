import { useAppTheme } from "@/hooks/useAppTheme";
import { useProfileConfig } from "@/hooks/useProfileConfig";
import { Box } from "@mui/material";
import Image from "next/image";

const ImageIntro = () => {
  const theme = useAppTheme();
  const { profileConfig } = useProfileConfig();

  const imageUrl = profileConfig?.imageUrl || profileConfig?.thumbUrl;
  const mySignUrl = `/img/sign-${
    theme.palette.mode === "light" ? "black" : "white"
  }.png`;
  return (
    <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
      <Box
        sx={{
          position: "relative",
          width: { xs: "230px", sm: "360px" },
          height: { xs: "230px", sm: "360px" },
          backgroundColor: theme.palette.background.paper,
          overflow: "hidden",
          zIndex: 2,
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
