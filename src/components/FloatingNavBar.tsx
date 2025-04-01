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
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          component="nav"
          sx={{
            backgroundColor: theme.palette.primary.main,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            >
              <ThemeToggleButton />
            </Box>

            <Box sx={{ display: { xs: "none", sm: "block" }, width: "100%" }}>
              <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
                sx={{
                  justifyContent: "flex-end",
                }}
              >
                {navItems.map(({ label, path }) => (
                  <Button
                    key={path}
                    component={Link}
                    href={path}
                    sx={{
                      color: "inherit",
                      fontWeight: pathname === path ? "bold" : "normal",
                      textTransform: "none",
                      ":hover": {
                        bgcolor: theme.palette.secondary.main,
                        color: theme.palette.primary.main,
                      },
                      "::after": {
                        content: '""',
                        position: "absolute",
                        bottom: -2, 
                        left: "25%",
                        width: pathname === path ? "0.5cm" : "0%", 
                        height: "2px",
                        backgroundColor: theme.palette.secondary.main,
                        transition: "width 0.3s ease-in-out",
                        transform: "translateX(-50%)", 
                      },

                    }}
                  >
                    {label}
                  </Button>
                ))}
              </Stack>
            </Box>
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
