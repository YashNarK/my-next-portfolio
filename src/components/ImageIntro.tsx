import { useAppTheme } from "@/hooks/useAppTheme";
import { Box } from "@mui/material";

const ImageIntro = () => {
  const myImageUrl = `url('/img/myImageCropped.png')`;
  const theme = useAppTheme();
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
          backgroundImage: myImageUrl,
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
            opacity: 0.8, // optional: to blend it better
          }}
        />
      </Box>
    </Box>
  );
};

export default ImageIntro;
