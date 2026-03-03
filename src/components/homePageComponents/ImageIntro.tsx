import { useAppTheme } from "@/hooks/useAppTheme";
import { useProfileConfig } from "@/hooks/useProfileConfig";
import { Box } from "@mui/material";

const ImageIntro = () => {
  const theme = useAppTheme();
  const { profileConfig } = useProfileConfig();

  const imageUrl = profileConfig?.imageUrl || "/img/myImageCropped.png";
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
          backgroundImage: `url('${imageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 2,
          borderRadius: "50%",
        }}
      >
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
