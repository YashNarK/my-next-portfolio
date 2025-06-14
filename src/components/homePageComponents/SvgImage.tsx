"use client";

import { motion } from "framer-motion";
import { ComponentProps } from "react";

type SvgImageProps = {
  src: string;
  alt: string;
  animation?: ComponentProps<typeof motion.img>;
};

export const SvgImage = ({ src, alt, animation }: SvgImageProps) => {
  return (
    <motion.img
      src={src}
      alt={alt}
      style={{
        display: "inline-block",
        marginLeft: "8px",
        marginRight: "8px",
        verticalAlign: "middle",
        width: "20px",
        height: "20px",
        ...(animation?.style || {}),
      }}
      {...animation}
    />
  );
};
