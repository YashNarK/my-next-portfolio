"use client";

import SocialButton from "@/components/navbarComponents/SocialButton";
import {
  GitHub,
  Instagram,
  LinkedIn,
  MailOutline,
} from "@mui/icons-material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { Box, Stack, Typography } from "@mui/material";

const socials = [
  {
    text: "Email",
    href: "mailto:ai.narendran@gmail.com",
    icon: <MailOutline />,
    themeSelector: "mail" as const,
  },
  {
    text: "LinkedIn",
    href: "https://www.linkedin.com/in/narendranai/",
    icon: <LinkedIn />,
    themeSelector: "linkedin" as const,
  },
  {
    text: "GitHub",
    href: "https://github.com/YashNarK",
    icon: <GitHub />,
    themeSelector: "github" as const,
  },
  {
    text: "Instagram",
    href: "https://www.instagram.com/narendran.a.i/",
    icon: <Instagram />,
    themeSelector: "instagram" as const,
  },
];

const Contact = () => (
  <Box sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 }, textAlign: "center" }}>
    <Typography
      variant="codeLike"
      sx={{
        display: "block",
        fontSize: { xs: "1.6rem", md: "2.2rem" },
        fontWeight: "bold",
        mb: 1.5,
      }}
    >
      Let&rsquo;s build something.
    </Typography>

    <Typography
      variant="professional"
      sx={{
        display: "block",
        maxWidth: 640,
        mx: "auto",
        opacity: 0.8,
        mb: 3,
        fontSize: { xs: "0.9rem", md: "1rem" },
        lineHeight: 1.7,
      }}
    >
      Open to senior full-stack, backend &amp; platform engineering roles. Reach
      out for collaborations, freelance work, or a chat about system design.
    </Typography>

    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
      sx={{ mb: 3, rowGap: 1, columnGap: 3, opacity: 0.85 }}
    >
      <Stack direction="row" spacing={0.5} alignItems="center">
        <LocationOnOutlinedIcon fontSize="small" />
        <Typography variant="professional" sx={{ fontSize: "0.9rem" }}>
          Chennai, Tamil Nadu, India
        </Typography>
      </Stack>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <PhoneOutlinedIcon fontSize="small" />
        <Typography
          component="a"
          href="tel:+918124084482"
          variant="professional"
          sx={{
            fontSize: "0.9rem",
            color: "inherit",
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          +91 81240 84482
        </Typography>
      </Stack>
    </Stack>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 180px))",
          md: "repeat(4, minmax(0, 170px))",
        },
        gap: 1.5,
        justifyContent: "center",
        maxWidth: 760,
        mx: "auto",
      }}
    >
      {socials.map((s) => (
        <SocialButton key={s.themeSelector} {...s} mode="full" />
      ))}
    </Box>
  </Box>
);

export default Contact;
