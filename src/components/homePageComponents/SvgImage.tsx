"use client";

import { Box } from "@mui/material";
import { motion } from "framer-motion";

type SvgImageProps = {
  src: string;
  alt: string;
  animation?: any;
};

export const SvgImage = ({ src, alt, animation }: SvgImageProps) => {
  return (
    <Box
      component={motion.img}
      src={src}
      alt={alt}
      width={{ xs: 20, sm: 30 }}
      height={{ xs: 20, sm: 30 }}
      sx={{
        display: "inline-block",
        mx: "8px",
        verticalAlign: "middle",
      }}
      {...(animation || {})}
    />
  );
};
