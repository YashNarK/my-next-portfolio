import { useAppTheme } from "@/hooks/useAppTheme";
import { Box, Stack, Typography } from "@mui/material";

const ImageIntro = () => {
  const myImageUrl = `url('/img/myImageCropped.png')`;
  const theme = useAppTheme();

  return (
    <>
      {" "}
      <Stack
        direction={"row"}
        sx={{
          position: "relative", // needed if you want elements to overlap
          alignItems: "center",
        }}
      >
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
            m: "auto",
          }}
        >
          {/* Signature Overlay */}
          <Box
            component="img"
            src="/img/sign-black.png"
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
      </Stack>
    </>
  );
};

export default ImageIntro;
