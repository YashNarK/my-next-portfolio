"use client";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Box, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const theme = useAppTheme();
  const adminMenu = [
    {
      name: "Projects",
      path: "admin/projects",
    },
    {
      name: "Experience",
      path: "admin/about",
    },
    {
      name: "Credentials",
      path: "admin/credentials",
    },
    {
      name: "Publications",
      path: "admin/publications",
    },
  ];
  return (
    <Box minHeight={"100%"} mt={20} textAlign={"center"}>
      <Typography
        variant="codeLike"
        sx={{
          textAlign: "center",
          mx: "auto",
        }}
      >
        Admin Dashboard
      </Typography>
      <Grid container spacing={3} mt={10}>
        {adminMenu.map((menu, index) => {
          return (
            <Grid
              size={{
                xs: 6,
                md: 4,
              }}
              key={index}
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="4cm"
                mx="auto"
                sx={{
                  width: {
                    xs: "100%",
                    md: "75%",
                  },
                  border: "1px solid gray",
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                    transform: "scale(1.2)",
                  },
                }}
                onClick={() => {
                  router.push(menu.path);
                }}
              >
                <Typography variant="professional">{menu.name}</Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default page;
