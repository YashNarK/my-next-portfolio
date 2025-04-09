"use client";

import { motion } from "framer-motion";
import { Box } from "@mui/material";

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
      width={30}
      height={30}
      sx={{
        display: "inline-block",
        mx: "8px",
        verticalAlign: "middle",
      }}
      {...(animation || {})}
    />
  );
};
