"use client";
import { useAppTheme } from "@/hooks/useAppTheme";
import { GitHub, Instagram, LinkedIn, MailOutline } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import SlideButton from "./SlideButton";
import SocialButton from "./SocialButton";
import ThemeToggleButton from "./ThemeToggleButton";
import useIsLandscape from "@/hooks/useIsLandscape";
import { Palette, SocialPaletteColor } from "@mui/material";

const drawerWidth = { xs: 240, sm: 400 };
const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Credentials", path: "/credentials" },
  { label: "Projects", path: "/projects" },
  { label: "Publications", path: "/publications" },
];
interface ISocialData {
  text: string;
  href: string;
  icon: React.ReactNode;
  themeSelector: keyof Palette["social"];
}
const ListSocialButtons = (
  social: Palette["social"],
  mode: "full" | "iconOnly" = "full"
) => {
  const socialDataList: ISocialData[] = [
    {
      text: "LinkedIn",
      href: "https://www.linkedin.com/in/narenkrithick/",
      icon: <LinkedIn />,
      themeSelector: "linkedin",
    },
    {
      text: "GitHub",
      href: "https://github.com/YashNarK",
      icon: <GitHub />,
      themeSelector: "github",
    },
    {
      text: "Instagram",
      href: "https://www.instagram.com/narendran.a.i/",
      icon: <Instagram />,
      themeSelector: "instagram",
    },
    {
      text: "Mail",
      href: "mailto:narenkrithick@gmail.com",
      icon: <MailOutline />,
      themeSelector: "mail",
    },
  ];

  return socialDataList.map((socialItem) => {
    return <SocialButton {...socialItem} mode={mode} />;
  });
};

export default function FloatingNavBar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useAppTheme();
  const social = theme.palette.social;
  const pathname = usePathname(); // Get current route
  const isLandscape = useIsLandscape();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box
      position={"relative"}
      height={"100%"}
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center" }}
    >
      <Box sx={{ my: 2 }}>
        <ThemeToggleButton />
      </Box>
      <Divider />
      <List>
        {navItems.map(({ label, path }) => (
          <ListItem key={path} disablePadding>
            <ListItemButton
              component={Link}
              href={path}
              sx={{
                textAlign: "center",
                bgcolor: "inherit",
                "&:hover": { bgcolor: "inherit", color: "inherit" },
                fontSize: {
                  xs: "1.2rem",
                  sm: "1.5rem",
                  md: "2rem",
                },
                my: isLandscape ? "0" : "1%",
              }}
            >
              <ListItemText primary={label} color="inherit" />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Stack
        direction={"column"}
        spacing={2}
        justifyContent={"end"}
        alignItems={"center"}
        position={"absolute"}
        bottom={30}
        left={{ xs: "20%", sm: "30%" }}
        divider={<Divider orientation="horizontal" flexItem />}
      >
        {ListSocialButtons(social, "full")}
      </Stack>
    </Box>
  );

  return (
    <>
      <Box>
        <CssBaseline />
        <AppBar
          component="nav"
          sx={{
            backgroundColor: theme.palette.primary.main,
            height: "100px",
          }}
        >
          <Toolbar
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              my: "auto",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { lg: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Use full-width Stack inside Toolbar */}
            <Stack
              direction={"row"}
              sx={{
                flexGrow: 1,
                alignItems: "center",
                justifyContent: { xs: "center", lg: "space-between" },
              }}
            >
              <Box sx={{ display: { xs: "none", lg: "block" } }}>
                <ThemeToggleButton />
              </Box>

              {/* Using social buttons here as icons */}
              <Stack
                display={{ xs: "none", lg: "flex" }}
                direction={"row"}
                spacing={2}
                justifyContent={"center"}
                alignItems={"center"}
                divider={<Divider orientation="vertical" flexItem />}
              >
                {ListSocialButtons(social, "iconOnly")}
              </Stack>

              <SlideButton />

              <Box sx={{ display: { xs: "none", lg: "block" } }}>
                <Stack
                  direction="row"
                  divider={<Divider orientation="vertical" flexItem />}
                  spacing={2}
                  sx={{ justifyContent: "flex-end" }}
                >
                  {navItems.map(({ label, path }) => (
                    <Button
                      key={path}
                      component={Link}
                      href={path}
                      sx={{
                        position: "relative",
                        color: "inherit",
                        fontWeight: pathname === path ? "bold" : "normal",
                        textTransform: "none",
                        ":hover": {
                          bgcolor: theme.palette.secondary.main,
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <Box component="span" sx={{ position: "relative" }}>
                        {label}
                        <Box
                          component="span"
                          sx={{
                            content: '""',
                            position: "absolute",
                            bottom: "-2px",
                            left: "50%",
                            width: pathname === path ? "0.5cm" : "0%",
                            height: "2px",
                            backgroundColor: theme.palette.secondary.main,
                            transition: "width 0.3s ease-in-out",
                            transform: "translateX(-50%)",
                          }}
                        />
                      </Box>
                    </Button>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Toolbar>
        </AppBar>

        <nav>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", lg: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        </nav>
      </Box>
    </>
  );
}
