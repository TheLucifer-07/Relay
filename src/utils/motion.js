export const easing = [0.22, 1, 0.36, 1];

export function reveal(shouldReduceMotion, delay = 0) {
  return {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.01 : 0.65, delay, ease: easing },
    },
  };
}
