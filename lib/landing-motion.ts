/**
 * Shared motion tokens for the landing page so scroll-reveals feel cohesive.
 */
export const LANDING_EASE = [0.22, 1, 0.36, 1] as const;

export const LANDING_VIEWPORT = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -56px 0px",
} as const;

/** Stagger between children in grid / lists */
export const LANDING_STAGGER_CHILD = 0.1;
export const LANDING_STAGGER_DELAY = 0.05;

/** One child block (fade + lift) */
export const LANDING_REVEAL_DURATION = 0.42;
