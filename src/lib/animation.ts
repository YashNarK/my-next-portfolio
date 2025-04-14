// src/lib/animations.ts
export const rotate = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 4,
      ease: "linear",
    },
  },
};

export const slideRightToLeft = {
  initial: { x: "0%" },
  animate: {
    x: "-40%",
    transition: { duration: 1, repeat: Infinity, ease: "linear" },
  },
};

export const zoomOutFade = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: 0,
    opacity: 0,
    transition: { duration: 2, repeat: Infinity },
  },
};

export const mirrorAndRevert = {
  initial: { scaleX: 1 },
  animate: {
    scaleX: [-1, 1],
    transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
  },
};

export const bounceUp = {
  initial: { y: "100%" },
  animate: {
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 10,
      repeat: Infinity,
    },
  },
};

export const pulseSpin = {
  initial: { scale: 1, rotate: 0 },
  animate: {
    scale: [1, 1.4, 1], // gentle pulse
    rotate: [0, 360],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
export const gravitationalRipple = {
  initial: {
    scale: 1,
    filter: "blur(0px)",
  },
  animate: {
    scale: [1, 1.03, 1],
    filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};
