"use client";
import { useAppTheme } from "@/hooks/useAppTheme";
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
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import ThemeToggleButton from "./ThemeToggleButton";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";
import SlideToLogin from "./SlideToLogin";

const drawerWidth = 240;
const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Credentials", path: "/credentials" },
  { label: "Projects", path: "/projects" },
  { label: "Publications", path: "/publications" },
];
export default function FloatingNavBar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useAppTheme();
  const pathname = usePathname(); // Get current route
  const user = "Guest";

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
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
              }}
            >
              <ListItemText primary={label} color="inherit" />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
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
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Use full-width Stack inside Toolbar */}
            <Stack
              direction={"row"}
              justifyContent={"space-around"}
              sx={{ flexGrow: 1, alignItems: "center" }}
            >
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <ThemeToggleButton />
              </Box>

              <Box>
                <Typography
                  component={"span"}
                  variant="professional"
                  sx={{ fontSize: { xs: "24px", sm: "24px", md: "32px" } }}
                >
                  Hi {user}
                </Typography>{" "}
              </Box>
              <SlideToLogin />

              <Box sx={{ display: { xs: "none", sm: "block" } }}>
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
              display: { xs: "block", sm: "none" },
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
