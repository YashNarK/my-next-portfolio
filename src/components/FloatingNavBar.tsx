"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ThemeToggleButton from "./ThemeToggleButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppTheme } from "@/hooks/useAppTheme";

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
            backgroundColor: theme.palette.background.paper,
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

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {navItems.map(({ label, path }) => (
                <Button
                  key={path}
                  component={Link}
                  href={path}
                  sx={{
                    color: "inherit",
                    fontWeight: pathname === path ? "bold" : "normal",
                    textTransform: "none",
                  }}
                >
                  {label}
                </Button>
              ))}
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
