export const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as number[] },
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.12 } },
};
